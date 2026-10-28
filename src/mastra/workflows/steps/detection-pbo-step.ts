import { createStep } from "@mastra/core/workflows";
import { qualiteSchema, resultatSchema } from "../schemas";

// Responsabilité unique : interroger l'agent sur une image déjà validée.
export const detectionPboStep = createStep({
  id: "detection-pbo",
  inputSchema: qualiteSchema,
  outputSchema: resultatSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData.ok) throw new Error("detection-pbo appelé sur une image rejetée");
    const reponse = await mastra.getAgent("detecteurPbo").generate([
      {
        role: "user",
        content: [
          { type: "text", text: "Y a-t-il un PBO sur cette photo ?" },
          { type: "image", image: Buffer.from(inputData.imageBase64, "base64") },
        ],
      },
    ]);
    return { statut: "analysee" as const, detection: reponse.object };
  },
});
