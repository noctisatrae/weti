import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { bearerAuth } from 'hono/bearer-auth'
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator'
import { asc, gt } from 'drizzle-orm';

import db from "../db";
import startMigration from '../db/migrate';
import { watchRequest, watchRequestSchema } from "../db/schema"

const TOKEN: string = process.env.TOKEN!;
const PORT: number = (process.env.PORT === undefined ? 3000 : +process.env.PORT);

const getJobsSchema = z.object({
  limit: z.number()
})

if (TOKEN === undefined) {
  console.error("Token not set! Quitting...");
  process.exit();
}

console.info("[INFO] Starting migration!");
await startMigration;

const app = new Hono()
app.use(logger())

app.use('/*', bearerAuth({ token: TOKEN }))

app.post('/watch', zValidator("json", watchRequestSchema), async (c) => {
  try {
    const body = (await c.req.json()) as z.infer<typeof watchRequestSchema>;

    // @ts-ignore : the complexity of the type makes it hard for the warning to be helpful lol. 
    // TODO: It works for now, might investigate later
    const result = await db.insert(watchRequest).values(body).returning().execute();

    return c.json({
      // @ts-ignore
      // TS is dumb AF I need a typescript wizard in my life!
      jobId: result.id
    });
  } catch (error) {
    console.error('Error inserting into DB:', error);
    return c.json({ error: 'An error occurred' }, { status: 500 });
  }
});

app.post('/jobs', zValidator("json", getJobsSchema), async (c) => {
  try {
    const body = (await c.req.json()) as z.infer<typeof getJobsSchema>;
    const validJobs = await db
      .select()
      .from(watchRequest)
      .where(gt(watchRequest.expiration, new Date().toISOString()))
      .orderBy(asc(watchRequest.expiration))
      .limit(body.limit);

    return c.json(validJobs);
  } catch (error) {
    console.error("Error getting jobs from DB:", error)
    return c.json({ error: 'An error occured' }, { status: 500 });
  }
})

console.info(`[INFO] Started at http://localhost:${PORT}`);
export default { 
  port: PORT, 
  fetch: app.fetch, 
}