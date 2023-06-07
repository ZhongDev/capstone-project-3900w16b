import { z } from "zod";

export const Restaurant = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string(),
});
