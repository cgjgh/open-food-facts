const AUTH_KEY = "off-user-credentials";

export interface OffCredentials {
  username?: string;
  password?: string;
}

export function getOffCredentials(): OffCredentials {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setOffCredentials(creds: OffCredentials): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(creds));
}
