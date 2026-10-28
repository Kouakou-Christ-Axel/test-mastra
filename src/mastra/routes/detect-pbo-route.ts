import { registerApiRoute } from "@mastra/core/server";

const TAILLE_MAX = 10 * 1024 * 1024; // 10 Mo

export const detectPboRoute = registerApiRoute("/detect-pbo", {
  method: "POST",
  handler: async (c) => {
    const form = await c.req.formData().catch(() => null);
    const image = form?.get("image");
    if (!(image instanceof File)) {
      return c.json({ erreur: "champ multipart 'image' manquant" }, 400);
    }
    if (image.size > TAILLE_MAX) {
      return c.json({ erreur: "image trop volumineuse (10 Mo max)" }, 413);
    }

    const imageBase64 = Buffer.from(await image.arrayBuffer()).toString("base64");
    const run = await c.get("mastra").getWorkflow("detectionPboWorkflow").createRun();
    const res = await run.start({ inputData: { imageBase64 } });

    if (res.status !== "success") {
      return c.json({ erreur: "échec du workflow", statut: res.status }, 500);
    }
    return c.json(res.result);
  },
});
