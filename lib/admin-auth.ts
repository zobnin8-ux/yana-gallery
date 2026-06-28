export const adminSessionCookieName = "yana-gallery-admin";

const DEFAULT_DEV_PASSWORD = "change-me";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function missingProductionAuthMessage(name: string) {
  return `${name} must be set in production. Add it in Vercel → Settings → Environment Variables.`;
}

export function getAdminPassword() {
  const value = process.env.GALLERY_ADMIN_PASSWORD?.trim();

  if (!value) {
    if (isProduction()) {
      throw new Error(missingProductionAuthMessage("GALLERY_ADMIN_PASSWORD"));
    }
    return DEFAULT_DEV_PASSWORD;
  }

  if (isProduction() && value === DEFAULT_DEV_PASSWORD) {
    throw new Error("GALLERY_ADMIN_PASSWORD cannot be the default value in production.");
  }

  return value;
}

export function getAdminSessionToken() {
  const value = process.env.GALLERY_ADMIN_SESSION_TOKEN?.trim();

  if (!value) {
    if (isProduction()) {
      throw new Error(missingProductionAuthMessage("GALLERY_ADMIN_SESSION_TOKEN"));
    }
    return "local-dev-admin-session";
  }

  if (isProduction() && value === getAdminPassword()) {
    throw new Error("GALLERY_ADMIN_SESSION_TOKEN must differ from GALLERY_ADMIN_PASSWORD.");
  }

  return value;
}

export function isAdminSession(value?: string | null) {
  return Boolean(value) && value === getAdminSessionToken();
}
