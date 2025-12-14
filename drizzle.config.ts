import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
