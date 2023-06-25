import { z } from "zod";

export const CreateCategoryRequest = z.object({
  name: z.string(),
  displayOrder: z.number(),
});

export const CreateItemRequest = z.object({
  categoryId: z.number(),
  displayOrder: z.number(),
  item: z.object({
    name: z.string(),
    description: z.string(),
    ingredients: z.string().nullable(),
    priceCents: z.number(),
  }),
});
