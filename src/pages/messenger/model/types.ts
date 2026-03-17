import { ChatType } from "@entities/chat/model/types.ts";
import { PageId } from "@pages/page/config/const.ts";
import {
  ChatId
} from "@shared/api/model/api.types";
import { BaseProps } from "@shared/lib/Component/model/base.types.ts";
import { ChildrenNodes } from "@shared/lib/Component/model/children.types.ts";
import { RootTag } from "@shared/lib/DOM/types.ts";

export interface MessengerProps extends BaseProps {
  configs: MessengerConfigs;
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

export type TypeStub = {
  type: Extract<MessengerType, "stub">;
};

export type TypeChat = {
  type: Extract<MessengerType, "chat">;
  chatId: ChatId;
  chatTitle: string;
};

export type TypeNote = {
  type: Extract<MessengerType, "notes">;
  chatId: ChatId;
  chatTitle: string;
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
