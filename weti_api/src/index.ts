import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { bearerAuth } from 'hono/bearer-auth'

import { z } from 'zod';
import { zValidator } from '@hono/zod-validator'

import { watchRequestSchema } from "../db/schema"
// import db from "../db";

const TOKEN: string = process.env.TOKEN!;
const PORT: number = (process.env.PORT === undefined ? 3000 : +process.env.PORT);

if (TOKEN === undefined) {
  console.error("Token not set! Quitting...");
  process.exit();
}

const app = new Hono()
app.use(logger())

// console.debug(db);

app.use('/*', bearerAuth({ token: TOKEN }))

app.post('/watch', zValidator("json", watchRequestSchema), async (c) => {
  const body = (await c.req.json()) as z.infer<typeof watchRequestSchema>
  return c.json({})
})

console.info(`[INFO] Started at http://localhost:${PORT}`);
export default { 
  port: PORT, 
  fetch: app.fetch, 
}