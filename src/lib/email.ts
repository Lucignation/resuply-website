import { Resend } from "resend";
import { supportEmail } from "@/lib/contact";
import type { ContactFormValues } from "@/lib/contact-validation";
import type {
  CategorizedShopperMarketSpecialty,
  WaitlistRole,
} from "@/lib/waitlist-validation";

type RegistrationEmailInput = {
  email: string;
  fullName: string;
  role: WaitlistRole;
  city: string;
  signupContext: string;
};

type SignupNotificationInput = RegistrationEmailInput & {
  phone: string;
  marketSpecialties: CategorizedShopperMarketSpecialty[];
};

type ContactMessageInput = ContactFormValues;

let resendClient: Resend | undefined;

function getResend() {
  if (resendClient) {
    return resendClient;
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

function getSender() {
  return process.env.EMAIL_FROM ?? "ReSuply <hello@useresuply.com>";
}

function getContactRecipient() {
  return process.env.CONTACT_NOTIFICATION_EMAIL ?? supportEmail;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getRegistrationCopy(role: WaitlistRole) {
  if (role === "shopper") {
    return {
      subject: "We received your ReSuply shopper application",
      headline: "Welcome to ReSuply",
      body: "Thanks for applying to become a ReSuply shopper. We have saved your details and the markets or stores you know, so we can review and categorize shoppers properly before launch.",
      next: "We will contact you when shopper onboarding starts in your city.",
      button: "Visit ReSuply",
    };
  }

  return {
    subject: "You are on the ReSuply waitlist",
    headline: "Welcome to ReSuply",
    body: "Thanks for joining the ReSuply waitlist. We have saved your details and will let you know when we launch in your city.",
    next: "You will be among the first to hear when ReSuply opens for early users.",
    button: "Visit ReSuply",
  };
}

export async function sendRegistrationEmail({
  email,
  fullName,
  role,
  city,
  signupContext,
}: RegistrationEmailInput) {
  const resend = getResend();
  const copy = getRegistrationCopy(role);
  const firstName = fullName.trim().split(/\s+/)[0] ?? "there";
  const safeFirstName = escapeHtml(firstName);
  const safeCity = escapeHtml(city);
  const safeSignupContext = escapeHtml(signupContext);
  const siteUrl = "https://useresuply.com/";
  const contextLabel =
    role === "customer"
      ? "What you may buy first"
      : "Place you know very well";

  const { error } = await resend.emails.send({
    from: getSender(),
    to: email,
    subject: copy.subject,
    html: `
      <div style="margin: 0; padding: 0; background: #f4f4f4; font-family: Arial, Helvetica, sans-serif;">
        <div style="max-width: 760px; margin: 0 auto; padding: 24px 18px 32px;">
          <div style="background: #ffffff; border: 1px solid #dedede; border-top: 8px solid #1f253d; padding: 54px 34px 44px;">
            <div style="text-align: center;">
              <img src="${siteUrl}resuply-logo-green.jpeg" width="76" height="76" alt="ReSuply logo" style="display: inline-block; border: 0; border-radius: 18px; width: 76px; height: 76px;" />
              <h1 style="margin: 42px 0 72px; color: #555555; font-size: 36px; line-height: 1.2; font-weight: 800;">
                ${copy.headline}
              </h1>
            </div>

            <p style="margin: 0 0 34px; color: #555555; font-size: 22px; line-height: 1.45;">
              Hello ${safeFirstName}!
            </p>

            <p style="margin: 0 0 8px; color: #555555; font-size: 22px; line-height: 1.45;">
              ${copy.body}
            </p>
            <p style="margin: 0 0 54px; color: #555555; font-size: 22px; line-height: 1.45;">
              ${copy.next}
            </p>

            <p style="margin: 0 0 54px; color: #555555; font-size: 18px; line-height: 1.45;">
              <strong>${contextLabel}:</strong> ${safeSignupContext}
            </p>

            <div style="text-align: center; margin: 0 0 76px;">
              <a href="${siteUrl}" style="display: inline-block; background: #2f6df6; color: #ffffff; text-decoration: none; border-radius: 4px; padding: 18px 44px; font-size: 20px;">
                ${copy.button}
              </a>
            </div>

            <p style="margin: 0 0 32px; color: #555555; font-size: 19px; line-height: 1.5;">
              Best regards,
            </p>
            <p style="margin: 0; color: #555555; font-size: 19px; line-height: 1.5;">
              The ReSuply Team<br />
              <a href="${siteUrl}" style="color: #2f6df6;">useresuply.com</a>
            </p>
          </div>

          <p style="margin: 26px 0 0; text-align: center; color: #999999; font-size: 15px; line-height: 1.5;">
            ReSuply, Lagos and Abuja, Nigeria<br />
            You received this email because you signed up for ReSuply in ${safeCity}.
          </p>
        </div>
      </div>
    `,
    text: `Hi ${firstName},\n\n${copy.body}\n\n${copy.next}\n\n${contextLabel}: ${signupContext}\nCity: ${city}\n\nReSuply`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendSignupNotificationEmail({
  email,
  fullName,
  role,
  city,
  phone,
  signupContext,
  marketSpecialties,
}: SignupNotificationInput) {
  const resend = getResend();
  const recipient =
    process.env.SIGNUP_NOTIFICATION_EMAIL ?? "resuplytech@gmail.com";
  const safeFullName = escapeHtml(fullName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeCity = escapeHtml(city);
  const safeSignupContext = escapeHtml(signupContext);
  const contextLabel =
    role === "customer"
      ? "Likely first purchase"
      : "Strongest known place";
  const marketSpecialtyHtml =
    role === "shopper"
      ? `<div><strong>Market specialties:</strong><ul>${marketSpecialties
          .map(
            (entry) => `<li><strong>${escapeHtml(
              entry.market
            )}</strong><ul>${entry.specialties
              .map(
                (specialty) =>
                  `<li>${escapeHtml(specialty.name)} (${escapeHtml(
                    specialty.category
                  )})</li>`
              )
              .join("")}</ul></li>`
          )
          .join("")}</ul></div>`
      : "";
  const marketSpecialtyText = marketSpecialties
    .map(
      (entry) =>
        `${entry.market}: ${entry.specialties
          .map((specialty) => `${specialty.name} (${specialty.category})`)
          .join(", ")}`
    )
    .join("; ");

  const { error } = await resend.emails.send({
    from: getSender(),
    to: recipient,
    subject: `New ReSuply ${role} signup`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #211d1a;">
        <h1>New ReSuply ${role} signup</h1>
        <p><strong>Name:</strong> ${safeFullName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>City:</strong> ${safeCity}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>${contextLabel}:</strong> ${safeSignupContext}</p>
        ${marketSpecialtyHtml}
      </div>
    `,
    text: [
      `New ReSuply ${role} signup`,
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `City: ${city}`,
      `Role: ${role}`,
      `${contextLabel}: ${signupContext}`,
      role === "shopper" ? `Market specialties: ${marketSpecialtyText}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendContactMessageEmail({
  fullName,
  phone,
  email,
  interest,
  message,
}: ContactMessageInput) {
  const resend = getResend();
  const recipient = getContactRecipient();
  const safeFullName = escapeHtml(fullName);
  const safePhone = escapeHtml(phone);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);
  const interestLabel =
    interest === "shopper" ? "Personal Shopper" : "Customer";

  const { error } = await resend.emails.send({
    from: getSender(),
    to: recipient,
    subject: `New ReSuply contact message from ${fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #211d1a;">
        <h1>New ReSuply contact message</h1>
        <p><strong>Name:</strong> ${safeFullName}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Interested as:</strong> ${interestLabel}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${safeMessage}</p>
      </div>
    `,
    text: [
      "New ReSuply contact message",
      `Name: ${fullName}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Interested as: ${interestLabel}`,
      "Message:",
      message,
    ].join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }
}
