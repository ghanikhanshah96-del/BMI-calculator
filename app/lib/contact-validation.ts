export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 254;
export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 4000;

// Letters from any language, optionally joined by spaces, apostrophes, hyphens, or periods
// (e.g. "Mary-Jane O'Neil", "J. R. Smith"). Digits and other symbols are rejected.
const namePattern = /^[\p{L}\p{M}]+(?:[ '’.-]+[\p{L}\p{M}]+)*\.?$/u;

const emailLocalPattern = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const domainLabelPattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const tldPattern = /^[A-Za-z]{2,63}$/;

const reservedTlds = new Set(["test", "example", "invalid", "localhost", "local", "internal"]);

const placeholderDomains = new Set([
  "example.com", "example.net", "example.org",
  "something.com", "somedomain.com", "domain.com", "mydomain.com", "yourdomain.com",
  "company.com", "yourcompany.com", "website.com", "yourwebsite.com",
  "test.com", "test.net", "test.org", "testing.com", "sample.com",
  "abc.com", "xyz.com", "asdf.com", "qwerty.com", "anything.com", "whatever.com",
  "fake.com", "fakeemail.com", "noemail.com", "nomail.com", "none.com", "invalid.com",
  "someone.com", "somewhere.com", "email.test",
]);

const disposableDomains = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com",
  "10minutemail.com", "tempmail.com", "temp-mail.org", "yopmail.com", "trashmail.com",
  "getnada.com", "dispostable.com", "maildrop.cc", "throwawaymail.com", "fakeinbox.com",
  "mintemail.com", "emailondeck.com", "mailnesia.com", "tempail.com",
]);

const domainTypos: Record<string, string> = {
  "gmai.com": "gmail.com", "gmial.com": "gmail.com", "gmaill.com": "gmail.com",
  "gamil.com": "gmail.com", "gnail.com": "gmail.com", "gmail.co": "gmail.com",
  "gmail.con": "gmail.com", "gmail.cm": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.co": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "yahooo.com": "yahoo.com", "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "outlok.com": "outlook.com", "outloo.com": "outlook.com", "outlook.co": "outlook.com",
  "outlook.con": "outlook.com",
  "iclod.com": "icloud.com", "icloud.co": "icloud.com", "icloud.con": "icloud.com",
};

export function validateName(rawName: string): string | null {
  const name = rawName.trim();
  if (!name) return "Please enter your name.";
  if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    return `Name must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters.`;
  }
  if (/\d/.test(name)) return "Name cannot contain numbers.";
  if (!namePattern.test(name)) {
    return "Name can only contain letters, spaces, hyphens (-), apostrophes (') and periods (.).";
  }
  return null;
}

export function getEmailDomain(email: string): string {
  return email.trim().slice(email.trim().lastIndexOf("@") + 1).toLowerCase();
}

export function validateEmailFormat(rawEmail: string): string | null {
  const email = rawEmail.trim();
  if (!email) return "Please enter your email address.";
  if (email.length > EMAIL_MAX_LENGTH) return "Email address is too long.";

  const atIndex = email.lastIndexOf("@");
  if (atIndex <= 0 || email.indexOf("@") !== atIndex) {
    return "Please enter a valid email address (e.g. name@gmail.com).";
  }

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1).toLowerCase();
  const labels = domain.split(".");
  const tld = labels[labels.length - 1];

  if (
    local.length > 64 ||
    !emailLocalPattern.test(local) ||
    domain.length > 253 ||
    labels.length < 2 ||
    !labels.every((label) => domainLabelPattern.test(label)) ||
    !tldPattern.test(tld)
  ) {
    return "Please enter a valid email address (e.g. name@gmail.com).";
  }

  if (domainTypos[domain]) {
    return `Did you mean ${local}@${domainTypos[domain]}?`;
  }
  if (reservedTlds.has(tld) || placeholderDomains.has(domain)) {
    return "Please use your real email address — this domain is a placeholder.";
  }
  if (disposableDomains.has(domain)) {
    return "Disposable email addresses are not accepted. Please use your real email.";
  }
  return null;
}

export function validateMessage(rawMessage: string): string | null {
  const message = rawMessage.trim();
  if (!message) return "Please enter a message.";
  if (message.length < MESSAGE_MIN_LENGTH || message.length > MESSAGE_MAX_LENGTH) {
    return `Message must be between ${MESSAGE_MIN_LENGTH} and ${MESSAGE_MAX_LENGTH} characters.`;
  }
  return null;
}
