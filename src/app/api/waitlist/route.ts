import {
  normalizeMarketSpecialties,
  normalizeEmail,
  normalizePhone,
  validateWaitlistForm,
  type WaitlistFormValues,
  type WaitlistRole,
} from "@/lib/waitlist-validation";
import { getSql } from "@/lib/db";
import {
  sendRegistrationEmail,
  sendSignupNotificationEmail,
} from "@/lib/email";

type WaitlistPayload = Omit<WaitlistFormValues, "marketSpecialties"> & {
  role: WaitlistRole;
  marketSpecialties?: WaitlistFormValues["marketSpecialties"];
};

function hasValidMarketSpecialties(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        typeof (entry as { market?: unknown }).market === "string" &&
        typeof (entry as { specialties?: unknown }).specialties === "string"
    )
  );
}

function isPayload(value: unknown): value is WaitlistPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<WaitlistPayload>;

  return (
    (payload.role === "customer" || payload.role === "shopper") &&
    typeof payload.fullName === "string" &&
    typeof payload.phone === "string" &&
    typeof payload.email === "string" &&
    typeof payload.city === "string" &&
    (payload.role === "customer"
      ? payload.marketSpecialties === undefined ||
        hasValidMarketSpecialties(payload.marketSpecialties)
      : hasValidMarketSpecialties(payload.marketSpecialties))
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (!isPayload(body)) {
    return Response.json({ message: "Invalid form payload." }, { status: 400 });
  }

  const formValues: WaitlistFormValues = {
    ...body,
    marketSpecialties: body.marketSpecialties ?? [],
  };

  const errors = validateWaitlistForm(formValues, body.role);

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 });
  }

  const fullName = body.fullName.trim();
  const city = body.city.trim();
  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);
  const marketSpecialties =
    body.role === "shopper"
      ? normalizeMarketSpecialties(formValues.marketSpecialties)
      : [];

  try {
    const sql = getSql();
    const existingSubscribers = (await sql`
      select id from launch_subscribers
      where email = ${email}
      limit 1
    `) as Array<{ id: string }>;

    if (existingSubscribers.length > 0) {
      return Response.json(
        { message: "This email is already on the ReSuply list." },
        { status: 409 }
      );
    }

    if (body.role === "customer") {
      await sql`
        insert into customers (full_name, email, phone, city, source)
        values (${fullName}, ${email}, ${phone}, ${city}, 'landing_page')
        on conflict (email) do update set
          full_name = excluded.full_name,
          phone = excluded.phone,
          city = excluded.city,
          source = excluded.source,
          updated_at = now()
      `;
    } else {
      const shopperRows = (await sql`
        insert into shoppers (full_name, email, phone, city, status, source)
        values (${fullName}, ${email}, ${phone}, ${city}, 'pending', 'landing_page')
        on conflict (email) do update set
          full_name = excluded.full_name,
          phone = excluded.phone,
          city = excluded.city,
          source = excluded.source,
          updated_at = now()
        returning id
      `) as Array<{ id: string }>;
      const [{ id: shopperId }] = shopperRows;

      for (const entry of marketSpecialties) {
        const marketName = entry.market;
        const marketRows = (await sql`
          insert into markets (name, city)
          values (${marketName}, ${city})
          on conflict (lower(name), lower(city)) do update set
            name = excluded.name,
            city = excluded.city,
            updated_at = now()
          returning id
        `) as Array<{ id: string }>;
        const [{ id: marketId }] = marketRows;

        const shopperMarketRows = (await sql`
          insert into shopper_markets (shopper_id, market_id)
          values (${shopperId}, ${marketId})
          on conflict (shopper_id, market_id) do update set
            shopper_id = excluded.shopper_id
          returning id
        `) as Array<{ id: string }>;
        const [{ id: shopperMarketId }] = shopperMarketRows;

        for (const specialty of entry.specialties) {
          const category = specialty.category;
          const specialtyRows = (await sql`
            insert into specialties (name, category)
            values (${specialty.name}, ${category})
            on conflict (lower(name)) do update set
              name = excluded.name,
              category = excluded.category,
              updated_at = now()
            returning id
          `) as Array<{ id: string }>;
          const [{ id: specialtyId }] = specialtyRows;

          await sql`
            insert into shopper_market_specialties (shopper_market_id, specialty_id)
            values (${shopperMarketId}, ${specialtyId})
            on conflict (shopper_market_id, specialty_id) do nothing
          `;
        }
      }
    }

    await sql`
      insert into launch_subscribers (email, full_name, phone, city, role, source)
      values (${email}, ${fullName}, ${phone}, ${city}, ${body.role}, 'landing_page')
      on conflict (email) do update set
        full_name = excluded.full_name,
        phone = excluded.phone,
        city = excluded.city,
        role = excluded.role,
        source = excluded.source,
        updated_at = now()
    `;

    await sendRegistrationEmail({
      email,
      fullName,
      role: body.role,
      city,
    });

    await sendSignupNotificationEmail({
      email,
      fullName,
      role: body.role,
      city,
      phone,
      marketSpecialties,
    });
  } catch (error) {
    console.error("Failed to save waitlist submission", error);
    return Response.json(
      { message: "We could not complete your registration. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
