import { i18n } from "@shared/i18n/I18nService.ts";
import { noteLabelsI18nKeys } from "../config/const.ts";

export function randomNoteLabel() {
  const randomKey =
    noteLabelsI18nKeys[Math.floor(Math.random() * noteLabelsI18nKeys.length)];
  return i18n.t(randomKey);
}
