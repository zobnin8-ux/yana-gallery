import { S3Client } from "@aws-sdk/client-s3";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID?.trim() &&
      process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim() &&
      process.env.R2_BUCKET_NAME?.trim() &&
      process.env.R2_PUBLIC_BASE_URL?.trim()
  );
}

let cachedClient: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!cachedClient) {
    const accountId = requiredEnv("R2_ACCOUNT_ID");
    if (!/^[a-f0-9]{32}$/i.test(accountId)) {
      throw new Error(
        "R2_ACCOUNT_ID должен быть 32-символьным Account ID из Cloudflare (без https:// и без пробелов)."
      );
    }

    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY")
      },
      // AWS SDK 3.729+ default checksums break R2 PutObject without this.
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED"
    });
  }
  return cachedClient;
}

export function getR2BucketName(): string {
  return requiredEnv("R2_BUCKET_NAME");
}

export function getR2PublicBaseUrl(): string {
  return requiredEnv("R2_PUBLIC_BASE_URL").replace(/\/$/, "");
}
