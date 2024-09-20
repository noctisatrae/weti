import { pgTable, jsonb, integer, timestamp, bigserial } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const ethereumRPCSchema = z.object({
  jsonrpc: z.literal("2.0"),
  method: z.string(),
  params: z.array(z.string()),
  id: z.number()
});

type RPC = z.infer<typeof ethereumRPCSchema>;
const watchRequest = pgTable('jobs', {
  id: bigserial("id", { mode: "number" }),
  frequency: integer("frequency"),
  expiration: timestamp('expiration', { mode: "string" }),
  rpc: jsonb('rpc').$type<RPC>()
});

const watchRequestSchema = createSelectSchema(watchRequest).omit({ id: true });

export {
  ethereumRPCSchema,
  watchRequest,
  watchRequestSchema
}