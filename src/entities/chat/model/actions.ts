import Store from "@app/providers/store/model/Store.ts";
import {
  ChatId,
  ChatResponse,
  CreateChatResponse,
  GetChatsQuery,
} from "@shared/api/model/api.types.ts";
import { ApiResponse } from "@shared/api/model/types.ts";
import { i18n } from "@shared/i18n/I18nService.ts";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import { GlobalEvent } from "@shared/lib/EventBus/events.ts";
import { ls_getLastChatId } from "@shared/lib/LocalStorage/actions.ts";
import ChatService from "./ChatService.ts";

export const handleAddUser = async (
  chatId: ChatId,
  user: number,
): Promise<ApiResponse<string>> => {

  return await ChatService.addUser(chatId, user);
};

export const handleCloseChat = () => {
  ChatService.deselectChat();
};

export const handleCreateChat = async (
  title: string,
  noToast = false,
  noFetch = false,
  noSelect = false,
): Promise<ApiResponse<CreateChatResponse>> => {
  if (!noToast)
    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n.t("toasts.chats.creatingStub").replace("${}", title),
    });

  const res = await ChatService.createChat(title);

  if (res.ok) {
    if (!noFetch) await ChatService.fetchChats();
    if (!noSelect) await ChatService.selectChat(res.data!.id);

    if (!noToast)
      globalBus.emit(GlobalEvent.Toast, {
        msg: i18n.t("toasts.chats.createSuccessStub").replace("${}", title),
      });
  } else {
    console.error("ChatService: createChat failed:", res);
    globalBus.emit(
      GlobalEvent.Toast,
      {
        msg: i18n
          .t("toasts.dev.devErrorStub")
          .replace("${}", res.err?.reason || ""),
      },
      "error",
    );
  }

  return res;
};

export const handleDeleteChat = async (id: number, chatTitle: string) => {
  globalBus.emit(GlobalEvent.Toast, {
    msg: i18n.t("toasts.chats.deleteLoading"),
  });
  const res = await ChatService.deleteChat(id);

  if (res.ok) {
    await ChatService.fetchChats();

    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n.t("toasts.chats.deleteSuccessStub").replace("${}", chatTitle),
      type: "success",
    });
    ChatService.deselectChat();
  } else {
    console.error("ChatService: deleteChat failed:", res);
    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n
        .t("toasts.dev.devErrorStub")
        .replace("${}", res.err?.reason || ""),
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
    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n
        .t("toasts.chats.fetchErrorStub")
        .replace("${}", resList.err?.reason || ""),
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

export const hardResetMessenger = async (): Promise<void> => {
  const chats = Store.getState().api.chats.list;
  const isEmpty = !chats || chats.length === 0;
  if (isEmpty) return;

  for (const chat of chats) {
    await ChatService.deleteChat(chat.id);
  }

  ChatService.deselectChat();
  Store.set("api.chats.list", []);
};
