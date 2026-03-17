import Store from "@app/providers/store/model/Store.ts";
import { handleSelectChat } from "@entities/chat/model/actions.ts";
import { ChatType } from "@entities/chat/model/types.ts";
import {
  ChatResponse,
  ISODateString
} from "@shared/api/model/api.types.ts";
import { i18n } from "@shared/i18n/I18nService.ts";
import {
  ChildGraph,
  ChildrenEdges,
  ChildrenNodes,
} from "@shared/lib/Component/model/children.types.ts";
import {
  ComponentDeps,
  ComponentId,
  ComponentNode,
  ComponentParams,
} from "@shared/lib/Component/model/types.ts";
import DOMService from "@shared/lib/DOM/DOMService.ts";
import FragmentService from "@shared/lib/Fragment/FragmentService.ts";
import { ComponentFactory } from "@shared/lib/helpers/factory/types.ts";
import { cx } from "@shared/lib/helpers/formatting/classnames.ts";
import { tinyDate } from "@shared/lib/helpers/formatting/date.ts";
import { getAvatarNode } from "@shared/ui/Avatar/factory.ts";
import { GoToChat } from "../ui/GoToChat.ts";
import css from "../ui/goToChat.module.css";
import { GoToChatConfigs, GoToChatProps } from "./types.ts";

export function getGoToChatGraph(
  apiChats: ChatResponse[],
  userLogin: string,
): ChildGraph {
  const goToChatNodes: ChildrenNodes = {};
  /* single edge for goToChat items-list {{{ goToChatItems }}} */
  const goToChatEdge: ChildrenEdges = {
    goToChatItems: [],
  };
  const goToChatItems = goToChatEdge.goToChatItems as ComponentId[];
  const { activeId: selectedChatId, messagesByChatId } =
    Store.getState().api.chats;

  for (const chat of apiChats) {
    const { id, type, title, avatar, last_message: lmsg } = chat;
    if (!type) {
      console.error("goToChat: chat type is not defined", chat, chat.type);
      continue;
    }

    const selected = id === selectedChatId;

    const componentId = `goToChatItem_${id}`;

    /* check if last message is a file via full ChatMessage history */
    const msgs = messagesByChatId?.[id];
    const lastFullMsg = msgs?.length ? msgs[msgs.length - 1] : null;
    const isMedia = !!lastFullMsg?.file;

    const youPrefix = lmsg?.user.login === userLogin
      ? i18n.t("messenger.message.youPrefix")
      : "";

    const contentText = isMedia
      ? youPrefix + i18n.t("messenger.message.mediaLabel")
      : youPrefix + (lmsg?.content ?? "");

    const goToChatNode = getGoToChatNode(componentId, type, id, title, {
      avatar,
      contentText,
      date: lmsg?.time,
      unreadCount: chat.unread_count,
      selected,
      on: {
        click: () => handleSelectChat(id),
      },
    });

    /* populating */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    goToChatNodes[componentId] = goToChatNode as any;
    goToChatItems.push(componentId);
  }

  return { nodes: goToChatNodes, edges: goToChatEdge };
}

const getGoToChatNode = (
  id: ComponentId,
  type: ChatType,
  chatId: number,
  userName: string,
  {
    avatar,
    contentText,
    date,
    unreadCount,
    selected,
    on,
  }: {
    avatar: string | null;
    contentText?: string;
    date?: ISODateString;
    unreadCount?: number;
    selected?: boolean;
    on?: GoToChatProps["on"];
  },
): ComponentNode<GoToChatProps, GoToChat> => {
  const params = getGoToChatParams(
    id,
    type,
    chatId,
    userName,
    avatar,
    contentText,
    unreadCount,
    date,
    selected,
    on,
  );

  return {
    params,
    factory: buildGoToChat,
    runtime: {
      instance: buildGoToChat(params),
    },
  };
};

const getGoToChatParams = (
  id: ComponentId,
  type: ChatType,
  chatId: number,
  userName: string,
  avatar: string | null,
  contentText: string = "",
  unreadCount: number = 0,
  date?: ISODateString,
  selected: boolean = false,
  on?: GoToChatProps["on"],
): ComponentParams<GoToChatProps> => {
  const configs: GoToChatConfigs = {
    id,
    rootTag: "li",
    type,
    classNames: cx(css.goToChat, selected ? css.goToChat_selected : ""),
    chatId,
    userName,
    avatar,
    contentText,
    unreadCount,
    date: tinyDate(date ?? ""),
    selected,
  };

  return {
    configs,
    on,
    children: {
      nodes: {
        chatAvatar: getAvatarNode(
          `chatAvatar`,
          chatId,
          userName,
          avatar,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any,
      },
      edges: {
        chatAvatar: "chatAvatar",
      },
    },
  };
};

const buildGoToChat: ComponentFactory<GoToChatProps, GoToChat> = (
  params: ComponentParams<GoToChatProps>,
): GoToChat => {
  const { id, rootTag } = params.configs;

  const deps: ComponentDeps<GoToChatProps> = {
    domService: new DOMService(id, rootTag),
    fragmentService: new FragmentService(),
  };
  const node: ComponentNode<GoToChatProps, GoToChat> = {
    params,
    factory: buildGoToChat,
  };

  return new GoToChat({ deps, node });
};
