import {
  ChatId,
  ChatResponse,
  CreateChatResponse,
  GetChatsQuery,
} from "@shared/api/model/api.types.ts";
import { ApiResponse } from "@shared/api/model/types.ts";
import { i18n } from "@shared/i18n/I18nService.ts";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import { ls_getLastChatId } from "@shared/lib/LocalStorage/actions.ts";
import ChatService from "./ChatService.ts";

export const handleAddUser = async (
  id: ChatId,
  user: number,
): Promise<ApiResponse<string>> => {
  return await ChatService.addUser(id, user);
};

export const handleCloseChat = () => {
  ChatService.deselectChat();
};

export const handleCreateChat = async (
  title: string,
  noToast = false,
): Promise<ApiResponse<CreateChatResponse>> => {
  if (!noToast)
    globalBus.emit("toast", {
      msg: `${i18n.t("toasts.chats.creatingStub")}'${title}' ..`,
    });

  const res = await ChatService.createChat(title);

  if (res.ok) {
    await ChatService.fetchChats();
    await ChatService.selectChat(res.data!.id);
    if (!noToast)
      globalBus.emit("toast", {
        msg: `'${title}'` + i18n.t("toasts.chats.createSuccessStub"),
      });
  } else {
    console.error("ChatService: createChat failed:", res);
    globalBus.emit(
      "toast",
      {
        msg: i18n.t("toasts.dev.devErrorStub") + res.err?.reason,
      },
      "error",
    );
  }

  return res;
};

export const handleDeleteChat = async (id: number, chatTitle: string) => {
  globalBus.emit("toast", { msg: i18n.t("toasts.chats.deleteLoading") });
  const res = await ChatService.deleteChat(id);

  if (res.ok) {
    await ChatService.fetchChats();

    globalBus.emit("toast", {
      msg: `'${chatTitle}'` + i18n.t("toasts.chats.deleteSuccessStub"),
      type: "success",
    });
    ChatService.deselectChat();
  } else {
    console.error("ChatService: deleteChat failed:", res);
    globalBus.emit("toast", {
      msg: i18n.t("toasts.dev.devErrorStub") + res.err?.reason,
      type: "error",
    });
  }
};

export const handleFetchChats = async (
  query?: GetChatsQuery,
): Promise<ApiResponse<ChatResponse[]>> => {
  const resList = await ChatService.fetchChats(query);

  if (!resList.ok) {
    console.error("fetchChats failed:", resList.err?.response);
    globalBus.emit("toast", {
      msg: i18n.t("toasts.chats.fetchErrorStub") + resList.err?.reason,
      type: "error",
    });
    return resList;
  }

  const list = resList.data;

  /* auto-restore last active chat */
  const last = Number(ls_getLastChatId());
  if (last && list!.some((chat) => chat.id === last))
    ChatService.selectChat(last);

  return resList;
};

export const handleRemoveUsers = async (id: ChatId, users: number[]) => {
  await ChatService.removeUsers(id, users);
  await ChatService.fetchChats();
};

export const handleSelectChat = async (id: number) => {
  await ChatService.selectChat(id);
};

export const handleUpdateChatAvatar = async (
  id: ChatId,
  file: File,
): Promise<void> => {
  await ChatService.updateChatAvatar(id, file);
  await ChatService.fetchChats();
};
