import { DEFAULT_LOCALE, type Locale } from "./config";
import type { Dict } from "./types";
import { en } from "./locales/en";
import { th } from "./locales/th";
import { fr } from "./locales/fr";
import { it } from "./locales/it";
import { de } from "./locales/de";
import { ja } from "./locales/ja";
import { ko } from "./locales/ko";
import { ms } from "./locales/ms";
import { id } from "./locales/id";
import { ru } from "./locales/ru";

export const messages: Record<Locale, Dict> = {
  en,
  th,
  fr,
  it,
  de,
  ja,
  ko,
  ms,
  id,
  ru,
};

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const dict = messages[locale];
  let val =
    getNestedSafe(dict, key) ?? getNestedSafe(messages[DEFAULT_LOCALE], key) ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      val = val.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return val;
}

function getNestedSafe(dict: Dict, key: string): string | undefined {
  const parts = key.split(".");
  let cur: string | Dict | undefined = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) cur = (cur as Dict)[p];
    else return undefined;
  }
  return typeof cur === "string" ? cur : undefined;
}
