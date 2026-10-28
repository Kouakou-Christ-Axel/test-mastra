import { createStep } from "@mastra/core/workflows";
import { qualiteSchema, resultatSchema } from "../schemas";

// Responsabilité unique : formater un rejet de qualité.
export const rejetStep = createStep({
  id: "rejet",
  inputSchema: qualiteSchema,
  outputSchema: resultatSchema,
  execute: async ({ inputData }) => ({
    statut: "rejetee" as const,
    raison: inputData.ok ? undefined : inputData.raison,
  }),
});
