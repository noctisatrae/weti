import { defineConfig, type Config } from 'drizzle-kit';

const checks = ["HOST", "USER", "PASSWORD", "NAME"];

let numErr = 0;
for (let i = 0; i in checks; i++) {
  if (process.env[`DB_${checks[i]}`] === undefined || process.env[`DB_${checks[i]}`] == "") {
    console.error(`DB_${checks[i]} not set!`);
    numErr++;
  }
}

if (numErr > 0) {
  console.error("Quitting...")
  process.exit();
}

// @ts-ignore
const config: Config = {
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // @ts-ignore
    host: process.env["DB_HOST"],
    user: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
    database: process.env["DB_NAME"]
  }
}

export default defineConfig(config);