import { Locale } from "@shared/i18n/types.ts";
import { ChatId } from "../../api/model/api.types.ts";

/* --- Auth (optimistic) --- */
export function ls_setLoggedIn(isLoggedIn: boolean): void {
  localStorage.setItem("isLoggedIn", String(isLoggedIn));
}

export function ls_getLoggedIn(): boolean {
  return localStorage.getItem("isLoggedIn") === "true";
}

/* --- Last Active Chat Id --- */
export function ls_storeLastChatId(chatId: ChatId): void {
  localStorage.setItem("lastActiveChatId", String(chatId));
}

export function ls_getLastChatId(): ChatId | null {
  return Number(localStorage.getItem("lastActiveChatId"));
}

export function ls_removeLastChatId(): void {
  localStorage.removeItem("lastActiveChatId");
}

/* --- Locale --- */
export function ls_setLocale(locale: Locale): void {
  localStorage.setItem("locale", locale);
}

export function ls_getLocale(): Locale {
  return localStorage.getItem("locale") as Locale ?? "en";
}
