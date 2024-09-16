import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { bearerAuth } from 'hono/bearer-auth'
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator'

import db from "../db";
import startMigration from '../db/migrate';
import { watchRequest, watchRequestSchema, ethereumRPCSchema } from "../db/schema"

const TOKEN: string = process.env.TOKEN!;
const PORT: number = (process.env.PORT === undefined ? 3000 : +process.env.PORT);

if (TOKEN === undefined) {
  console.error("Token not set! Quitting...");
  process.exit();
}

console.info("Starting migration!");
await startMigration;

const app = new Hono()
app.use(logger())

// console.debug(db);

app.use('/*', bearerAuth({ token: TOKEN }))

db.insert(watchRequest).values({
  frequency: 500,
  rpc: {
    jsonrpc: "2.0",
    params: ["0x0000"],
    method: "eth_getbalance",
    id: 1
  }
})

app.post('/watch', zValidator("json", watchRequestSchema), async (c) => {
  const body = (await c.req.json()) as z.infer<typeof watchRequestSchema>
  return c.json(body);
})

console.info(`[INFO] Started at http://localhost:${PORT}`);
export default { 
  port: PORT, 
  fetch: app.fetch, 
}