import ar from "./ar.json";
import he from "./he.json";

export type Dictionary = typeof ar;

const dictionaries = { ar, he };

export function getDictionary(lang: string): Dictionary {
  return lang === "he" ? dictionaries.he : dictionaries.ar;
}