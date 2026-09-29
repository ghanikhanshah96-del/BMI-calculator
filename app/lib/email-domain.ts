import { Resolver } from "node:dns/promises";

type DomainStatus = "valid" | "invalid" | "unknown";

const NOT_FOUND_CODES = new Set(["ENOTFOUND", "ENODATA", "NXDOMAIN"]);
const PUBLIC_DNS_SERVERS = ["1.1.1.1", "8.8.8.8"];

function createResolver(servers?: string[]) {
  const resolver = new Resolver({ timeout: 3000, tries: 1 });
  if (servers) resolver.setServers(servers);
  return resolver;
}

function isNotFound(error: unknown) {
  return NOT_FOUND_CODES.has((error as NodeJS.ErrnoException)?.code ?? "");
}

async function lookupAddress(resolver: Resolver, domain: string): Promise<DomainStatus> {
  const lookups = await Promise.allSettled([resolver.resolve4(domain), resolver.resolve6(domain)]);
  if (lookups.some((result) => result.status === "fulfilled" && result.value.length > 0)) {
    return "valid";
  }
  return lookups.every((result) => result.status === "rejected" && isNotFound(result.reason))
    ? "invalid"
    : "unknown";
}

async function lookupDomain(resolver: Resolver, domain: string): Promise<DomainStatus> {
  try {
    const records = await resolver.resolveMx(domain);
    const usable = records.filter((record) => record.exchange && record.exchange !== ".");
    if (usable.length > 0) return "valid";
    if (records.length > 0) return "invalid";
  } catch (error) {
    if (!isNotFound(error)) return "unknown";
  }

  // RFC 5321: with no MX record, mail falls back to the domain's A/AAAA record.
  return lookupAddress(resolver, domain);
}

/**
 * Returns an error message if the domain cannot receive email, otherwise null.
 * If DNS is unreachable (timeouts, offline resolver) the user is not blocked.
 */
export async function checkEmailDomain(domain: string): Promise<string | null> {
  let status = await lookupDomain(createResolver(), domain);
  if (status === "unknown") {
    status = await lookupDomain(createResolver(PUBLIC_DNS_SERVERS), domain);
  }

  return status === "invalid"
    ? `The domain "${domain}" does not exist or cannot receive email. Please check your address.`
    : null;
}
