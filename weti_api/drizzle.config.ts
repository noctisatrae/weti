import { defineConfig, type Config } from 'drizzle-kit';

const DB_HOST = "localhost:5432"
const DB_USER = "postgres"
const DB_PASSWORD = "jesuisunecarotte"
const DB_NAME = "postgres"

// const checks = ["HOST", "USER", "PASSWORD", "NAME"];

// let numErr = 0;
// for (let i = 0; i in checks; i++) {
//   if (process.env[`DB_${checks[i]}`] === undefined || process.env[`DB_${checks[i]}`] == "") {
//     console.error(`DB_${checks[i]} not set!`);
//     numErr++;
//   }
// }

// if (numErr > 0) {
//   console.error("Quitting...")
//   process.exit();
// }

// @ts-ignore
const config: Config = {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // @ts-ignore
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  }
}

export default defineConfig(config);