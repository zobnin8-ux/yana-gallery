export const adminSessionCookieName = "yana-gallery-admin";

export function getAdminPassword() {
  return process.env.GALLERY_ADMIN_PASSWORD ?? "change-me";
}

export function getAdminSessionToken() {
  return process.env.GALLERY_ADMIN_SESSION_TOKEN ?? `local-${getAdminPassword()}`;
}

export function isAdminSession(value?: string | null) {
  return Boolean(value) && value === getAdminSessionToken();
}
