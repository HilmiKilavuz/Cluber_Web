export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
} as const;


if (!env.NEXT_PUBLIC_API_URL && typeof window !== "undefined") {
  console.warn("NEXT_PUBLIC_API_URL is not defined");
}


