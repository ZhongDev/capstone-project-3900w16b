import { number, z } from "zod";

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
    minPrepMins: z.number().optional(),
    maxPrepMins: z.number().optional(),
    alterations: z
      .array(
        z.object({
          optionName: z.string(),
          maxChoices: z.number().int(),
          options: z.array(z.string()),
        })
      )
      .optional(),
  }),
});

export const CreateAlterationRequest = z.object({
  itemId: z.number(),
  maxChoices: z.number().int(),
  optionName: z.string(),
  options: z.array(z.string()),
});

export const CreateAlterationOptionRequest = z.object({
  alterationId: z.number(),
  choice: z.string(),
});

export const UpdateAlterationOptionRequest = z.object({
  choice: z.string(),
});

export const UpdateAlterationRequest = z.object({
  maxChoices: z.number().int().optional(),
  optionName: z.string().optional(),
});

export const UpdateItemRequest = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  ingredients: z.string().nullable().optional(),
  priceCents: z.number().optional(),
  displayOrder: z.number().optional(),
  minPrepMins: z.number().optional(),
  maxPrepMins: z.number().optional(),
});

export const ReorderCategoriesRequest = z.object({
  categoryOrder: z.array(z.number()),
});

export const ReorderItemsRequest = z.object({
  categoryId: z.number(),
  itemOrder: z.array(z.number()),
});
