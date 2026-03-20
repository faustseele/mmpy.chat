import ChatService from "@entities/chat/model/ChatService.ts";
import { ChatId } from "@shared/api/model/api.types.ts";
import ResourcesAPI from "@shared/api/ResourcesAPI.ts";
import { i18n } from "@shared/i18n/I18nService.ts";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import { GlobalEvent } from "@shared/lib/EventBus/events.ts";
import css from "../ui/messageField.module.css";

export const handleSendMessage = (e: Event, chatId: ChatId) => {
  e.preventDefault()

  const el = e.target as HTMLFormElement;
  const input = el.getElementsByClassName(css.input)[0] as HTMLInputElement;
  const text = (input as HTMLInputElement)?.value?.trim();

  if (text) {
    ChatService.sendMessage(chatId, text);
    (input as HTMLInputElement).value = "";
  }
};

export const handleAttachImage = async (e: Event, chatId: ChatId) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    try {
      globalBus.emit(GlobalEvent.Toast, { msg: i18n.t("toasts.message.uploadImageLoading") });
      const resource = await ResourcesAPI.upload(file);
      ChatService.sendFile(chatId, resource.id);
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  }
};
