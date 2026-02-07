import { ChatType } from "@/entities/chat/model/types.ts";
import {
  ChatId,
  CreateChatResponse,
  UserResponse,
} from "@/shared/api/model/api.types";
import { ApiResponse } from "@/shared/api/model/types.ts";
import { PageId } from "@pages/page/config/const.ts";
import { BaseProps } from "@shared/lib/Component/model/base.types.ts";
import { ChildrenNodes } from "@shared/lib/Component/model/children.types.ts";
import { RootTag } from "@shared/lib/DOM/types.ts";

export interface MessengerProps extends BaseProps {
  configs: MessengerConfigs;
  on: MessengerOn;
}

export type MessengerConfigs = {
  id: PageId.Messenger;
  rootTag: Extract<RootTag, "div">;
  classNames: string;
  info: TypeStub | TypeChat | TypeNote;
  isLoadingMessages?: boolean;
  hasMessages?: boolean;
};

export type MessengerType = "stub" | ChatType;

type TypeStub = {
  type: Extract<MessengerType, "stub">;
};

type TypeChat = {
  type: Extract<MessengerType, "chat">;
  chatId: ChatId;
  chatTitle: string;
};

type TypeNote = {
  type: Extract<MessengerType, "notes">;
  chatId: ChatId;
  chatTitle: string;
};

export type MessengerOn = {
  addChatWithUser: (
    firstName: string,
    secondName: string,
  ) => Promise<ApiResponse<CreateChatResponse>>;
  addNotes: (title: string) => void;
  addUser: (chatId: ChatId, user: number) => Promise<ApiResponse<string>>;
  deleteChat: (chatId: ChatId, chatTitle: string) => Promise<void>;
  findUser: (login: string) => Promise<ApiResponse<UserResponse>>;
  updateChatAvatar: (chatId: ChatId, file: File) => Promise<void>;
};

export type MessengerMap =
  | "heading_chats"
  | "heading_goToSettings"
  | "searchInput"
  | "addNotesButton"
  | "findUserChatButton"
  | "closeChatButton"
  | "deleteChatButton"
  | "deleteNotesButton"
  | "goToChatItems"
  | "chatAvatar"
  | "messages"
  | "isLoadingMessages"
  | "hasMessages"
  | "messageField"
  | "spinner";

export type MessengerNodes = ChildrenNodes<MessengerMap>;
