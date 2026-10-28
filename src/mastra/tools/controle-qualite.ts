import sharp from "sharp";

export type Raison = "floue" | "sombre" | "surexposee" | "trop_petite";

const LARGEUR_MIN = 160;
const LARGEUR_CIBLE = 1000;
const FLOU_MIN = 100; // variance du Laplacien ; à calibrer sur des vraies photos
const LUM_MIN = 50;
const LUM_MAX = 215;

export async function controleQualite(input: Buffer) {
  const { width = 0 } = await sharp(input).metadata();
  if (width < LARGEUR_MIN) return { ok: false as const, raison: "trop_petite" as Raison };

  // rotate() applique l'orientation EXIF ; pas d'agrandissement si déjà plus petite
  const image = await sharp(input)
    .rotate()
    .resize({ width: LARGEUR_CIBLE, withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  const { data, info } = await sharp(image).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  let somme = 0;
  for (const v of data) somme += v;
  const luminosite = somme / data.length;
  if (luminosite < LUM_MIN) return { ok: false as const, raison: "sombre" as Raison };
  if (luminosite > LUM_MAX) return { ok: false as const, raison: "surexposee" as Raison };

  // variance du Laplacien (noyau 4-voisins)
  let s = 0, s2 = 0, n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const l = data[i - 1] + data[i + 1] + data[i - w] + data[i + w] - 4 * data[i];
      s += l;
      s2 += l * l;
      n++;
    }
  }
  const variance = s2 / n - (s / n) ** 2;
  if (variance < FLOU_MIN) return { ok: false as const, raison: "floue" as Raison };

  return { ok: true as const, image }; // image redimensionnée (~1000 px), à envoyer au modèle
}
