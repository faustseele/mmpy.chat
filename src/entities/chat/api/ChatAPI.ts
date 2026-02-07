import HTTPTransport from "@shared/api/http/HTTPTransport.ts";
import { BaseAPI } from "@shared/api/model/BaseAPI.ts";
import {
  ChatId,
  ChatResponse,
  ChatTokenResponse,
  ChatUser,
  ChatUsersQuery,
  ChatUsersRequest,
  ChatUsersResponse,
  CreateChatRequest,
  CreateChatResponse,
  DeleteChatRequest,
  DeleteChatResponse,
  GetChatsQuery,
  UpdateChatAvatarResponse,
} from "@/shared/api/model/api.types";

const chatsAPIInstance = new HTTPTransport("/chats");

class ChatAPI extends BaseAPI {
  public getChats(query?: GetChatsQuery): Promise<ChatResponse[]> {
    return chatsAPIInstance.get(
      "",
      query ? { data: query } : undefined,
    ) as Promise<ChatResponse[]>;
  }

  public createChat(data: CreateChatRequest): Promise<CreateChatResponse> {
    return chatsAPIInstance.post("", { data }) as Promise<CreateChatResponse>;
  }

  public updateChatAvatar(
    chatId: ChatId,
    avatar: File,
  ): Promise<UpdateChatAvatarResponse> {
    const form = new FormData();
    form.append("chatId", String(chatId));
    form.append("avatar", avatar);
    console.log('', form)
    return chatsAPIInstance.put("/avatar", {
      data: form,
    }) as Promise<UpdateChatAvatarResponse>;
  }

  public deleteChat(data: DeleteChatRequest): Promise<DeleteChatResponse> {
    return chatsAPIInstance.delete("", { data }) as Promise<DeleteChatResponse>;
  }

  public addUser(data: ChatUsersRequest): Promise<ChatUsersResponse> {
    return chatsAPIInstance.put("/users", {
      data,
    }) as Promise<ChatUsersResponse>;
  }

  public removeUsers(data: ChatUsersRequest): Promise<ChatUsersResponse> {
    return chatsAPIInstance.delete("/users", {
      data,
    }) as Promise<ChatUsersResponse>;
  }

  public getUsers(chatId: ChatId, query?: ChatUsersQuery): Promise<ChatUser[]> {
    return chatsAPIInstance.get(
      `/${chatId}/users`,
      query ? { data: query } : undefined,
    ) as Promise<ChatUser[]>;
  }

  public getToken(chatId: ChatId): Promise<ChatTokenResponse> {
    return chatsAPIInstance.post(
      `/token/${chatId}`,
    ) as Promise<ChatTokenResponse>;
  }
}

export default new ChatAPI();
