import { createStep } from "@mastra/core/workflows";
import { controleQualite } from "../../tools/controle-qualite";
import { imageInputSchema, qualiteSchema } from "../schemas";

// Responsabilité unique : valider et redimensionner l'image.
export const controleQualiteStep = createStep({
  id: "controle-qualite",
  inputSchema: imageInputSchema,
  outputSchema: qualiteSchema,
  execute: async ({ inputData }) => {
    const r = await controleQualite(Buffer.from(inputData.imageBase64, "base64"));
    return r.ok
      ? { ok: true as const, imageBase64: r.image.toString("base64") }
      : { ok: false as const, raison: r.raison };
  },
});
