export type Locale = "en" | "de" | "ru" | "jp" | "th";

/**
 * recursive type representing a nested translation dictionary
 */
export type Dictionary = {
  [key: string]: string | Dictionary;
};
