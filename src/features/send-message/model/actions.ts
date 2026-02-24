import ChatService from "@entities/chat/model/ChatService.ts";
import ResourcesAPI from "@shared/api/ResourcesAPI.ts";
import css from "../ui/messageField.module.css";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import { i18n } from "@shared/i18n/I18nService.ts";

export const handleSendMessage = (e: Event) => {
  e.preventDefault()

  const el = e.target as HTMLFormElement;
  const input = el.getElementsByClassName(css.input)[0] as HTMLInputElement;
  const text = (input as HTMLInputElement)?.value?.trim();

  if (text) {
    ChatService.sendMessage(text);
    (input as HTMLInputElement).value = "";
  }
};

export const handleAttachImage = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    try {
      globalBus.emit("toast", { msg: i18n.t("toasts.message.uploadImageLoading") });
      const resource = await ResourcesAPI.upload(file);
      ChatService.sendFile(resource.id);
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  }
};
