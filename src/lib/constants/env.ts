const getEnvVariable = (key: "NEXT_PUBLIC_API_URL"): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const env = {
  NEXT_PUBLIC_API_URL: getEnvVariable("NEXT_PUBLIC_API_URL"),
} as const;

