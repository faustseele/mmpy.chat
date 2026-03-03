import { Dictionary } from "./types.ts";

/**
 * resolves a nested translation key from a dictionary object
 * * @param {Dictionary} dictionary - parsed JSON locale dictionary
 * @param {string} path - dot-separated path (e.g., 'auth.login.title')
 * @returns {string} resolved translation or the original path if unresolved
 */
export const resolveKey = (dictionary: Dictionary, path: string): string => {
  if (!path) {
    console.error("i18n.resolveKey: path is empty");
    return path;
  }
  const keys = path.split(".");

  let current: Dictionary | string | undefined = dictionary;

  for (const key of keys) {
    if (typeof current === "string" || current === undefined) {
      current = undefined;
      break;
    }
    current = current[key];
  }

  if (typeof current === "string") return current;

  console.error(`unresolved translation key: ${path}`);
  return path;
};
