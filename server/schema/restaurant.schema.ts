import { z } from "zod";

export const CreateRestaurantRequest = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string(),
}); 

export const LoginRequest = z.object({
  email: z.string(),
  password: z.string(),
});

export const CreateTableRequest = z.object({
  name: z.string().min(1),
});
