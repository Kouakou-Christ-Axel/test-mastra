import { z } from "zod";
import { detecteurPboOutputSchema } from "../agents/detecteur-pbo";

export const imageInputSchema = z.object({
  imageBase64: z.string().describe("image encodée en base64"),
});

export const qualiteSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), imageBase64: z.string() }),
  z.object({
    ok: z.literal(false),
    raison: z.enum(["floue", "sombre", "surexposee", "trop_petite"]),
  }),
]);

export const resultatSchema = z.object({
  statut: z.enum(["analysee", "rejetee"]),
  raison: z.string().optional(),
  detection: detecteurPboOutputSchema.optional(),
});
