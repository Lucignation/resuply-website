export type WaitlistRole = "customer" | "shopper";

export type ShopperMarketSpecialty = {
  market: string;
  specialties: string;
};

export type CategorizedSpecialty = {
  name: string;
  category: string;
};

export type CategorizedShopperMarketSpecialty = {
  market: string;
  specialties: CategorizedSpecialty[];
};

export type WaitlistFormValues = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  customerFirstPurchase: string;
  shopperKnownPlace: string;
  marketSpecialties: ShopperMarketSpecialty[];
};

export type WaitlistFormErrors = Partial<
  Record<keyof WaitlistFormValues, string>
>;

export const initialWaitlistValues: WaitlistFormValues = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  customerFirstPurchase: "",
  shopperKnownPlace: "",
  marketSpecialties: [{ market: "", specialties: "" }],
};

const blockedEmailDomains = new Set([
  "example.com",
  "example.net",
  "example.org",
  "exmaple.com",
]);

const allowedTemporaryEmailDomains = new Set(["yomail.com"]);

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string) {
  const phoneDigits = value.replace(/\D/g, "");

  if (phoneDigits.startsWith("0")) {
    return `234${phoneDigits.slice(1)}`;
  }

  return phoneDigits;
}

export function parseSpecialtyNames(value: string) {
  return value
    .split(",")
    .map((specialty) => specialty.trim())
    .filter(Boolean);
}

function normalizeLabel(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function getSpecialtyCategory(name: string) {
  const normalized = name.trim().toLowerCase();

  if (
    [
      "tomatoes",
      "tomato",
      "red pepper",
      "pepper",
      "tatase",
      "rodo",
      "onions",
    ].includes(normalized)
  ) {
    return "Produce";
  }

  if (["rice", "beans", "garri", "yam", "plantain"].includes(normalized)) {
    return "Staples";
  }

  if (["meat", "beef", "chicken", "goat meat"].includes(normalized)) {
    return "Meat";
  }

  if (["fish", "dry fish", "stockfish"].includes(normalized)) {
    return "Fish";
  }

  if (normalized.includes("grocery") || normalized.includes("groceries")) {
    return "General groceries";
  }

  return "Other";
}

export function normalizeMarketSpecialties(
  entries: ShopperMarketSpecialty[]
): CategorizedShopperMarketSpecialty[] {
  const marketMap = new Map<string, CategorizedShopperMarketSpecialty>();

  for (const entry of entries) {
    const market = normalizeLabel(entry.market);

    if (!market) {
      continue;
    }

    const marketKey = market.toLowerCase();
    const normalizedEntry = marketMap.get(marketKey) ?? {
      market,
      specialties: [],
    };
    const specialtyKeys = new Set(
      normalizedEntry.specialties.map((specialty) =>
        specialty.name.toLowerCase()
      )
    );

    for (const rawSpecialty of parseSpecialtyNames(entry.specialties)) {
      const specialtyName = normalizeLabel(rawSpecialty);
      const specialtyKey = specialtyName.toLowerCase();

      if (!specialtyName || specialtyKeys.has(specialtyKey)) {
        continue;
      }

      normalizedEntry.specialties.push({
        name: specialtyName,
        category: getSpecialtyCategory(specialtyName),
      });
      specialtyKeys.add(specialtyKey);
    }

    marketMap.set(marketKey, normalizedEntry);
  }

  return Array.from(marketMap.values());
}

function isValidNigerianPhone(value: string) {
  const phoneDigits = value.replace(/\D/g, "");

  return /^(0[789][01]\d{8}|234[789][01]\d{8})$/.test(phoneDigits);
}

function validateEmail(value: string) {
  const email = normalizeEmail(value);
  const domain = email.split("@")[1] ?? "";

  if (!email) {
    return "Enter your email address.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }

  if (email === "test@test.com") {
    return "Use your real email address, not a test email.";
  }

  if (
    blockedEmailDomains.has(domain) &&
    !allowedTemporaryEmailDomains.has(domain)
  ) {
    return "Use your real email address, not a placeholder domain.";
  }

  return undefined;
}

function validateSpecialties(value: string) {
  const specialties = parseSpecialtyNames(value);

  if (specialties.length === 0) {
    return "List at least one thing you are good at buying.";
  }

  if (specialties.some((specialty) => specialty.length < 3)) {
    return "Each specialty should be at least 3 characters.";
  }

  return undefined;
}

function validateMarketSpecialties(entries: ShopperMarketSpecialty[]) {
  if (entries.length === 0) {
    return "Add at least one market and what you buy there.";
  }

  for (const [index, entry] of entries.entries()) {
    const market = entry.market.trim();

    if (!market) {
      return `Enter the market or store name for market ${index + 1}.`;
    }

    if (market.length < 3) {
      return `Market ${index + 1} should be at least 3 characters.`;
    }

    if (["lagos", "abuja"].includes(market.toLowerCase())) {
      return `Enter a specific market or store for market ${index + 1}, not just a city.`;
    }

    const specialtiesError = validateSpecialties(entry.specialties);

    if (specialtiesError) {
      return `Market ${index + 1}: ${specialtiesError}`;
    }
  }

  return undefined;
}

function validateCustomerFirstPurchase(value: string) {
  const normalized = normalizeLabel(value);

  if (!normalized) {
    return "Tell us what you would likely use ReSuply to buy first.";
  }

  if (normalized.length < 3) {
    return "Your answer should be at least 3 characters.";
  }

  return undefined;
}

function validateShopperKnownPlace(value: string) {
  const normalized = normalizeLabel(value);

  if (!normalized) {
    return "Enter a market, supermarket, pharmacy, mall, or store you know well.";
  }

  if (normalized.length < 3) {
    return "The place name should be at least 3 characters.";
  }

  if (["lagos", "abuja"].includes(normalized.toLowerCase())) {
    return "Enter a specific place you know well, not just a city.";
  }

  return undefined;
}

export function validateWaitlistForm(
  values: WaitlistFormValues,
  role: WaitlistRole
) {
  const errors: WaitlistFormErrors = {};
  const fullName = values.fullName.trim();
  const city = values.city.trim();

  if (!fullName) {
    errors.fullName = "Enter your full name.";
  } else if (fullName.length < 3 || !fullName.includes(" ")) {
    errors.fullName = "Enter your first and last name.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Enter your phone number.";
  } else if (!isValidNigerianPhone(values.phone)) {
    errors.phone = "Enter a valid Nigerian mobile number.";
  }

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (!city) {
    errors.city = "Enter your city.";
  } else if (city.length < 2) {
    errors.city = "City name is too short.";
  }

  if (role === "customer") {
    const customerFirstPurchaseError = validateCustomerFirstPurchase(
      values.customerFirstPurchase
    );

    if (customerFirstPurchaseError) {
      errors.customerFirstPurchase = customerFirstPurchaseError;
    }
  } else {
    const shopperKnownPlaceError = validateShopperKnownPlace(
      values.shopperKnownPlace
    );

    if (shopperKnownPlaceError) {
      errors.shopperKnownPlace = shopperKnownPlaceError;
    }

    const marketSpecialtiesError = validateMarketSpecialties(
      values.marketSpecialties
    );
    if (marketSpecialtiesError) {
      errors.marketSpecialties = marketSpecialtiesError;
    }
  }

  return errors;
}
