import {
  ChatId,
  ChatResponse,
  ChatUser,
  ChatUsersQuery,
  CreateChatResponse,
  GetChatsQuery,
  UpdateChatAvatarResponse,
} from "@/shared/api/model/api.types.ts";
import { ApiError, ApiResponse } from "@/shared/api/model/types.ts";
import Store from "@app/providers/store/model/Store.ts";
import { ls_storeLastChatId } from "@shared/lib/LocalStorage/actions.ts";
import ChatAPI from "../api/ChatAPI.ts";
import { ChatWebsocket } from "../lib/ChatWebsocket.ts";
import { isChatNotes } from "./utils.ts";

class ChatService {
  private ws = new ChatWebsocket();

  public async fetchChats(
    query?: GetChatsQuery,
  ): Promise<ApiResponse<ChatResponse[]>> {
    try {
      const setChatsTypes = async (
        chats: ChatResponse[],
      ): Promise<ChatResponse[]> => {
        return await Promise.all(
          chats.map(async (chat) => {
            const isNotes = await isChatNotes(chat.id);
            chat.type = isNotes ? "notes" : "chat";
            return chat;
          }),
        );
      };

      let list = await ChatAPI.getChats(query);
      list = await setChatsTypes(list);

      Store.set("api.chats.list", list);
      console.log("chats fetch success !:", list);

      return { ok: true, data: list };
    } catch (e) {
      const badCookie = (e as ApiError).status === 401;

      if (badCookie) {
        console.info("chats fetch fail, probably not logged in", e);
      } else {
        console.error("chats fetch fail", e);
      }

      return { ok: false, err: e as ApiError };
    }
  }

  public async selectChat(chatId: number): Promise<ApiResponse<unknown>> {
    try {
      Store.set("api.chats.activeId", chatId);
      ls_storeLastChatId(chatId);

      const list = Store.getState().api.chats.list;

      /* evading api.chats.list mutation */
      const currentRaw =
        list?.find((c: ChatResponse) => c.id === chatId) ?? null;
      const current = currentRaw ? structuredClone(currentRaw) : null;
      Store.set("api.chats.currentChat", current);

      if (!current) {
        console.error("Current chat not found", chatId);
        return {
          ok: false,
          err: {
            status: 404,
            reason: "Not found",
            response: `Non-API: Chat ${chatId} not found`,
          },
        };
      }

      const user = Store.getState().api.auth.user;
      if (!user) {
        console.error("Bad user selection", Store.getState().api);
        return {
          ok: false,
          err: {
            status: 401,
            reason: "Unauthorized",
            response: "Non-API resp: Bad user selection",
          },
        };
      }

      /* closing prev socket */
      const prevId = Store.getState().api.chats.activeId;
      if (prevId && prevId !== chatId) this.ws.closeWS(prevId);

      const { token } = await ChatAPI.getToken(chatId);
      this.ws.openWS(user.id, chatId, token);

      // console.log("chat select success !, token:", token);
      return { ok: true };
    } catch (e) {
      console.error("chat select failed:", e);
      return { ok: false, err: e as ApiError };
    }
  }

  public async createChat(
    title: string,
  ): Promise<ApiResponse<CreateChatResponse>> {
    try {
      const chat = await ChatAPI.createChat({ title });
      console.log(`chat ${title} create success !:`, chat);

      return { ok: true, data: chat };
    } catch (e) {
      console.error("chat create failed:", e);
      return { ok: false, err: e as ApiError };
    }
  }

  public async updateChatAvatar(
    chatId: ChatId,
    avatar: File,
  ): Promise<ApiResponse<UpdateChatAvatarResponse>> {
    try {
      const updatedChat = await ChatAPI.updateChatAvatar(chatId, avatar);
      console.log("chat avatar update success:", updatedChat);

      return { ok: true, data: updatedChat };
    } catch (e) {
      console.error("chat avatar update fail:", e);
      return { ok: false, err: e as ApiError };
    }
  }

  public async deleteChat(chatId: ChatId): Promise<ApiResponse<string>> {
    try {
      const res = await ChatAPI.deleteChat({ chatId });
      this.ws.closeWS(chatId);

      console.log("chat delete success !:", res);
      return { ok: true, data: res };
    } catch (e) {
      console.error("chat delete failed:", e);
      return { ok: false, err: e as ApiError };
    }
  }

  public async addUser(
    chatId: ChatId,
    user: number,
  ): Promise<ApiResponse<string>> {
    try {
      const res = await ChatAPI.addUser({ chatId, users: [user] });

      console.log("user-add success:", res);
      return { ok: true, data: res };
    } catch (e) {
      console.error("user-add failed:", e);
      return { ok: false, err: e as ApiError };
    }
  }

  public async removeUsers(
    chatId: ChatId,
    users: number[],
  ): Promise<ApiResponse<string>> {
    try {
      const res = await ChatAPI.removeUsers({ chatId, users });

      console.log("users-remove success:", res, chatId);
      return { ok: true, data: res };
    } catch (e) {
      console.error("users-remove failed:", e);
      return { ok: false, err: e as ApiError };
    }
  }

  public async getUsers(
    chatId: ChatId,
    query?: ChatUsersQuery,
  ): Promise<ApiResponse<ChatUser[]>> {
    try {
      const res = await ChatAPI.getUsers(chatId, query);

      console.log("users-get success:", res);
      return { ok: true, data: res };
    } catch (e) {
      console.error(`users-get failed, chatId=${chatId}, query=${query}`, e);
      return { ok: false, err: e as ApiError };
    }
  }

  public isCurrentChatNotes(): boolean {
    return Store.getState().api.chats.currentChat?.type === "notes";
  }

  public sendMessage (content: string) {
    this.ws.sendMessage(content);
  }

  public deselectChat() {
    const currId = Store.getState().api.chats.activeId;
    if (currId) this.ws.closeWS(currId);

    Store.set("api.chats.activeId", null);
    Store.set("api.chats.currentChat", null);
  }
}

export default new ChatService();
