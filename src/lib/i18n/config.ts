export const LOCALES = [
  "en",
  "th",
  "fr",
  "it",
  "de",
  "ja",
  "ko",
  "ms",
  "id",
  "ru",
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  th: "ไทย",
  fr: "Français",
  it: "Italiano",
  de: "Deutsch",
  ja: "日本語",
  ko: "한국어",
  ms: "Melayu",
  id: "Indonesia",
  ru: "Русский",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  th: "🇹🇭",
  fr: "🇫🇷",
  it: "🇮🇹",
  de: "🇩🇪",
  ja: "🇯🇵",
  ko: "🇰🇷",
  ms: "🇲🇾",
  id: "🇮🇩",
  ru: "🇷🇺",
};
