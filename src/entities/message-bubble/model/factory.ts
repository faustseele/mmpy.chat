import Store from "@app/providers/store/model/Store.ts";
import ResourcesAPI from "@shared/api/ResourcesAPI.ts";
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
import { tinyDate } from "@shared/lib/helpers/formatting/date.ts";
import css from "../ui/messageBubble.module.css";
import { MessageBubble } from "../ui/MessageBubble.ts";
import { MessageProps, MessageType } from "./types.ts";

export function getMessagesGraph(): ChildGraph {
  const state = Store.getState();

  const activeId = state.api.chats.activeId;
  const byChat = state.api.chats.messagesByChatId || {};
  const rawMessages = activeId ? byChat[activeId] || [] : [];
  const myId = state.api.auth.user?.id;

  const messageNodes: ChildrenNodes = {};
  /* single edge for messages items-list {{{ messages }}} */
  const messageEdge: ChildrenEdges = {
    messages: [],
  };
  const messages = messageEdge.messages as ComponentId[];

  rawMessages.forEach((msg) => {
    const id = `message_${msg.id}`;
    const type = msg.user_id === myId ? "outgoing" : "incoming";

    const messageNode = getMessageNode(id, type, tinyDate(msg.time), {
      text: msg.content,
      image: msg.file ? ResourcesAPI.getResourcePath(msg.file.path) : undefined,
    });

    /* populating */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messageNodes[id] = messageNode as any;
    messages.push(id);
  });

  return { nodes: messageNodes, edges: messageEdge };
}

export const getMessageNode = (
  id: ComponentId,
  type: MessageType,
  date: string,
  {
    text,
    image,
  }: {
    text?: string;
    image?: string;
  },
): ComponentNode<MessageProps, MessageBubble> => {
  const params = getMessageParams(id, type, date, text, image);
  return {
    params,
    factory: buildMessage,
    runtime: {
      instance: buildMessage(params),
    },
  };
};

const getMessageParams = (
  id: ComponentId,
  type: MessageType,
  date: string,
  text: string = "",
  image?: string,
): ComponentParams<MessageProps> => {
  return {
    configs: {
      id,
      rootTag: "article",
      classNames: css.message,
      type,
      date,
      text,
      image,
    },
  };
};

const buildMessage: ComponentFactory<MessageProps, MessageBubble> = (
  params: ComponentParams<MessageProps>,
): MessageBubble => {
  const { id, rootTag } = params.configs;
  const deps: ComponentDeps<MessageProps> = {
    domService: new DOMService(id, rootTag),
    fragmentService: new FragmentService(),
  };

  const node: ComponentNode<MessageProps, MessageBubble> = {
    params,
    factory: buildMessage,
  };

  return new MessageBubble({ deps, node });
};
