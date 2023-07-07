import { z } from "zod";

export const CreateCategoryRequest = z.object({
  name: z.string(),
});

export const UpdateCategoryRequest = z.object({
  name: z.string().optional(),
  displayOrder: z.number().optional(),
});

export const CreateItemRequest = z.object({
  categoryId: z.number(),
  item: z.object({
    name: z.string(),
    description: z.string(),
    ingredients: z.string().nullable(),
    priceCents: z.number(),
  }),
});

export const UpdateItemRequest = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  ingredients: z.string().nullable().optional(),
  priceCents: z.number().optional(),
  displayOrder: z.number().optional(),
});