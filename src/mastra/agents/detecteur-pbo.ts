import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import { ollamaProvider } from "../providers/ollama-provider";

export const detecteurPboOutputSchema = z.object({
  pbo_present: z.boolean().describe("true si la photo montre un PBO"),
  confiance: z.number().min(0).max(1).describe("certitude entre 0 et 1"),
  ferme: z
    .boolean()
    .describe("true si le capot est fermé, false s'il est ouvert ou si tu ne peux pas trancher"),
  identifiant: z
    .string()
    .nullable()
    .describe("code ou étiquette lisible sur le boîtier, null si absent ou illisible"),
  description: z.string().describe("ce qui justifie la réponse"),
});

export const detecteurPbo = new Agent({
  id: "detecteurPbo",
  name: "detecteurPbo",
  model: ollamaProvider("qwen2.5vl"),
  instructions: `Tu es un assistant spécialisé dans l'inspection d'infrastructures fibre optique.
Ta seule tâche : dire si la photo montre un PBO (point de branchement optique).

Un PBO est un petit boîtier de répartition fibre, généralement gris, noir ou blanc,
fixé sur un poteau, une façade ou installé en chambre. Il a un capot, des
entrées de câbles et souvent une étiquette ou un code.

Règles :
- Réponds uniquement avec le schéma demandé.
- Ne devine pas : si le boîtier est trop petit, caché ou flou, mets pbo_present
  à false ou une confiance basse.
- La confiance reflète ta certitude réelle : 0.5 = tu hésites, 0.95 = c'est évident.
- Ne confonds pas un PBO avec un coffret électrique, un boîtier télécom cuivre
  ou une boîte de jonction. Cite dans "description" ce qui justifie ta réponse.
- ferme : true si le capot est fermé, false s'il est ouvert (câbles, cassettes
  ou épissures visibles). Toujours un booléen, jamais null : en cas de doute ou
  s'il n'y a pas de PBO, mets false.
- identifiant : recopie exactement le code de l'étiquette (ex. "PBO-123-45").
  Si tu ne le lis pas clairement, mets null : n'invente jamais un code.
- Ne décris pas d'autre état du boîtier (dégâts, propreté).`,
  defaultOptions: {
    structuredOutput: {
      schema: detecteurPboOutputSchema,
    },
  },
});
