/* eslint-disable @typescript-eslint/no-explicit-any */
import { cx } from "@shared/lib/helpers/formatting/classnames.ts";
import { getAvatarNode } from "@shared/ui/Avatar/factory.ts";
import { getButtonNode } from "@shared/ui/Button/factory.ts";
import { getHeadingNode } from "@shared/ui/Heading/factory.ts";
import { getInputNode } from "@shared/ui/Input/factory.ts";
import { getSpinnerNode } from "@shared/ui/Spinner/factory.ts";
import { RouteConfigs } from "@app/providers/router/types.ts";
import {
  handleAddUser,
  handleCloseChat,
  handleCreateChat,
  handleDeleteChat,
  handleUpdateChatAvatar,
} from "@entities/chat/model/actions.ts";
import { getMessageFieldNode } from "@features/send-message/model/factory.ts";
import { PageId } from "@pages/page/config/const.ts";
import cssPage from "@pages/page/ui/page.module.css";
import { ROOT_QUERY } from "@shared/config/dom.ts";
import { ComponentParams } from "@shared/lib/Component/model/types.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { handleFindUser, handleGoToSettings } from "../model/actions.ts";
import { MessengerConfigs, MessengerProps } from "../model/types.ts";
import css from "../ui/messenger.module.css";
import { i18n } from "@shared/i18n/I18nService.ts";

export const getBaseMessengerConfigs = (
  info: MessengerConfigs["info"],
  isLoadingMessages = false,
  hasMessages = false,
): MessengerProps["configs"] => ({
  id: PageId.Messenger,
  rootTag: "div",
  classNames: cx(cssPage.moduleWindow, css.moduleWindow_messenger),
  info,
  isLoadingMessages,
  hasMessages,
});

export const messengerPageParams: ComponentParams<MessengerProps> = {
  configs: getBaseMessengerConfigs({
    type: "stub",
  } satisfies MessengerConfigs["info"]),
  children: {
    nodes: {
      heading_chats: getHeadingNode("heading_chats", "messenger.header.chats") as any,
      heading_goToSettings: getHeadingNode(
        "heading_goToSettings",
        "messenger.header.profile",
        {
          isClickable: true,
          on: { click: handleGoToSettings },
        },
      ) as any,
      searchInput: getInputNode("searchInput", "search", i18n.t("messenger.search.placeholder")) as any,
      chatAvatar: getAvatarNode("chatAvatar", 0) as any,
      addNotesButton: getButtonNode("addNotesButton", "messenger.buttons.addNote", {
        i18nTooltipKey: "messenger.buttons.addNoteTooltip",
      }) as any,
      findUserChatButton: getButtonNode(
        "findUserChatButton",
        "messenger.buttons.findUser",
        { i18nTooltipKey: "messenger.buttons.findUserTooltip" },
      ) as any,
      closeChatButton: getButtonNode("closeChatButton", "messenger.buttons.closeChat", {
        i18nTooltipKey: "messenger.buttons.closeChatTooltip",
        isSilent: true,
        on: { click: handleCloseChat },
      }) as any,
      deleteNotesButton: getButtonNode(
        "deleteNotesButton",
        "messenger.buttons.deleteNotes",
        { i18nTooltipKey: "messenger.buttons.deleteNotesTooltip", isSilent: true },
      ) as any,
      deleteChatButton: getButtonNode("deleteChatButton", "messenger.buttons.deleteChat", {
        i18nTooltipKey: "messenger.buttons.deleteChatTooltip",
        isSilent: true,
      }) as any,
      spinner: getSpinnerNode(true) as any,
      messageField: getMessageFieldNode("messageField") as any,
    },
    edges: {
      heading_chats: "heading_chats",
      heading_goToSettings: "heading_goToSettings",
      searchInput: "searchInput",
      chatAvatar: "chatAvatar",
      addNotesButton: "addNotesButton",
      findUserChatButton: "findUserChatButton",
      closeChatButton: "closeChatButton",
      deleteChatButton: "deleteChatButton",
      deleteNotesButton: "deleteNotesButton",
      messageField: "messageField",
      goToChatItems: [],
      messages: [],
      spinner: "spinner",
    },
  },
  on: {
    addChatWithUser: (firstName: string, secondName: string) =>
      handleCreateChat(`${firstName} ${secondName}`, true),
    addNotes: handleCreateChat,
    addUser: handleAddUser,
    deleteChat: handleDeleteChat,
    findUser: handleFindUser,
    updateChatAvatar: handleUpdateChatAvatar,
  },
};

export const messengerPageRouteConfig: RouteConfigs = {
  path: RouteLink.Messenger,
  rootQuery: ROOT_QUERY,
  authStatus: "protected",
  params: {},
};
