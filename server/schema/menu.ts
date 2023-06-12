import { z } from "zod";

export const Category = z.object({
  name: z.string(),
  displayOrder: z.number(),
});
