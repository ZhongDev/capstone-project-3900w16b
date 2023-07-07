import { z } from "zod";

export const CreateOrderRequest = z.object({
  itemId: z.number(),
  units: z.number().gte(1),
  device: z.string().nullable().optional().default(null),
});
