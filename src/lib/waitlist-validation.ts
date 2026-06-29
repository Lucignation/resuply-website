export type WaitlistRole = "customer" | "shopper";

export type WaitlistFormValues = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  markets: string;
};

export type WaitlistFormErrors = Partial<
  Record<keyof WaitlistFormValues, string>
>;

export const initialWaitlistValues: WaitlistFormValues = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  markets: "",
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

export function parseMarketNames(value: string) {
  return value
    .split(",")
    .map((market) => market.trim())
    .filter(Boolean);
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

function validateMarkets(value: string) {
  const marketNames = parseMarketNames(value);

  if (marketNames.length === 0) {
    return "List at least one market or store you know well.";
  }

  if (marketNames.some((market) => market.length < 3)) {
    return "Each market or store name should be at least 3 characters.";
  }

  if (
    marketNames.some((market) =>
      ["lagos", "abuja"].includes(market.toLowerCase())
    )
  ) {
    return "Enter specific market or store names, not just a city.";
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

  if (role === "shopper") {
    const marketsError = validateMarkets(values.markets);
    if (marketsError) {
      errors.markets = marketsError;
    }
  }

  return errors;
}
