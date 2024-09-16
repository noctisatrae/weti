import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { bearerAuth } from 'hono/bearer-auth'

import { z } from 'zod';
import { zValidator } from '@hono/zod-validator'

const TOKEN: string = process.env.TOKEN!;
const PORT: number = (process.env.PORT === undefined ? 3000 : +process.env.PORT);

if (TOKEN === undefined) {
  console.error("Token not set! Quitting...");
  process.exit();
}

const app = new Hono()
app.use(logger())

const ethereumRPCSchema = z.object({
  jsonrpc: z.literal("2.0"),
  method: z.string(),
  params: z.array(z.string()),
  id: z.number()
});

// Define the WatchRequest schema
const watchReqSchema = z.object({
  frequency: z.number(),
  rpc: ethereumRPCSchema
});

app.use('/*', bearerAuth({ token: TOKEN }))

app.post('/watch', zValidator("json", watchReqSchema), async (c) => {
  const body = (await c.req.json()) as z.infer<typeof watchReqSchema>
  return c.json({})
})

console.info(`[INFO] Started at http://localhost:${PORT}`);
export default { 
  port: PORT, 
  fetch: app.fetch, 
}