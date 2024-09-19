import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { bearerAuth } from 'hono/bearer-auth'
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator'

import db from "../db";
import startMigration from '../db/migrate';
import { watchRequest, watchRequestSchema } from "../db/schema"

const TOKEN: string = process.env.TOKEN!;
const PORT: number = (process.env.PORT === undefined ? 3000 : +process.env.PORT);

if (TOKEN === undefined) {
  console.error("Token not set! Quitting...");
  process.exit();
}

console.info("[INFO] Starting migration!");
await startMigration;

const app = new Hono()
app.use(logger())

// console.debug(db);

app.use('/*', bearerAuth({ token: TOKEN }))

app.post('/watch', zValidator("json", watchRequestSchema), async (c) => {
  try {
    const body = (await c.req.json()) as z.infer<typeof watchRequestSchema>;

    const result = await db.insert(watchRequest).values(body).returning().execute();

    console.log('Insert result:', result); // Log result to verify insertion

    return c.json(body);
  } catch (error) {
    console.error('Error inserting into DB:', error);
    return c.json({ error: 'An error occurred' }, { status: 500 });
  }
});

console.info(`[INFO] Started at http://localhost:${PORT}`);
export default { 
  port: PORT, 
  fetch: app.fetch, 
}