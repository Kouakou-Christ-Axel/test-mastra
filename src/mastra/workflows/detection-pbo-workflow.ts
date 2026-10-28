import { createWorkflow } from "@mastra/core/workflows";
import { imageInputSchema, resultatSchema } from "./schemas";
import { controleQualiteStep } from "./steps/controle-qualite-step";
import { detectionPboStep } from "./steps/detection-pbo-step";
import { rejetStep } from "./steps/rejet-step";

export const detectionPboWorkflow = createWorkflow({
  id: "detection-pbo-workflow",
  inputSchema: imageInputSchema,
  outputSchema: resultatSchema,
})
  .then(controleQualiteStep)
  .branch([
    [async ({ inputData }) => inputData.ok, detectionPboStep],
    [async ({ inputData }) => !inputData.ok, rejetStep],
  ])
  .map(async ({ inputData }) => {
    const r = inputData["detection-pbo"] ?? inputData["rejet"];
    return r!;
  })
  .commit();
