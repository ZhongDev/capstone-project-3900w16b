import { z } from "zod";

export const CreateHelpCallRequest = z.object({
  tableId: z.number(),
  device: z.string().nullable().optional().default(null),
});

export const UpdateHelpCallRequest = z.object({
  newStatus: z.string(),
});
