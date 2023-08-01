import { z } from "zod";

export const CreateOrderRequest = z.object({
  device: z.string().nullable().optional().default(null),
  items: z.array(
    z.object({
      itemId: z.number(),
      units: z.number().gte(1),
      alterations: z
        .array(
          z.object({
            alterationId: z.number(),
            selectedOptions: z.array(z.number()),
          })
        )
        .optional(),
    })
  ),
});
