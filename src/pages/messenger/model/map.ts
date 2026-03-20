import { handleUpdateChatAvatar } from "@entities/chat/model/actions.ts";
import { getAvatarNode } from "@shared/ui/Avatar/factory.ts";
import { AppState } from "@app/providers/store/model/Store.ts";
import { getMessagesGraph } from "@entities/message-bubble/model/factory.ts";
import { getGoToChatGraph } from "@features/go-to-chat/model/factory.ts";
import { ComponentPatch } from "@shared/lib/Component/model/types.ts";
import { getBaseMessengerConfigs } from "../config/params.ts";
import { MessengerProps, MessengerType } from "./types.ts";

export const mapMessengerState = (
  state: AppState,
): ComponentPatch<MessengerProps> => {
  const { list: chats, activeId, messagesByChatId } = state.api.chats;
  const currentChat = activeId
    ? (chats?.find((chat) => chat.id === activeId) ?? null)
    : null;

  /* loading if there's an active chat but no msgs loaded yet */
  const isLoadingMessages = activeId ? !messagesByChatId[activeId] : false;
  const hasMessages = activeId
    ? (messagesByChatId[activeId]?.length ?? 0) > 0
    : false;

  const type = ((): MessengerType => {
    if (!activeId) return "stub";

    if (!currentChat?.type) {
      return "stub";
    }

    return currentChat.type;
  })();

  const info = {
    type,
    chatId: currentChat?.id ?? 0,
    chatTitle: currentChat?.title ?? "",
  };

  const chatAvatar = getAvatarNode(
    "chatAvatar",
    currentChat?.id ?? 0,
    currentChat?.title,
    currentChat?.avatar,
    {
      updateAvatar: (file) =>
        handleUpdateChatAvatar(currentChat?.id ?? 0, file),
      hasInput: type === "notes",
      size: "l",
    },
  );

  const updatedConfigs = getBaseMessengerConfigs(
    info,
    isLoadingMessages,
    hasMessages,
  );

  const sortedChats = [...(chats ?? [])].sort((a, b) => {
    const timeA = a.last_message?.time ?? "";
    const timeB = b.last_message?.time ?? "";
    return timeB.localeCompare(timeA);
  });

  const goToChatPatch = getGoToChatGraph(sortedChats ?? [], state.api.auth.user?.login ?? "");

  const messagesPatch = getMessagesGraph();

  if (!goToChatPatch.nodes) {
    console.error("goToChatNodesPatch is not defined");
  }

  return {
    configs: updatedConfigs,
    children: {
      nodes: {
        ...goToChatPatch.nodes,
        ...messagesPatch.nodes,
        chatAvatar,
      },
      edges: {
        ...goToChatPatch.edges,
        ...messagesPatch.edges,
        chatAvatar: "chatAvatar",
      },
    },
  };
};
