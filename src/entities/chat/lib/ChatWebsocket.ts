import { ChatId, ChatMessage } from "@shared/api/model/api.types";
import { ApiResponse } from "@shared/api/model/types.ts";
import Store from "@app/providers/store/model/Store.ts";
import { WSS_CHATS } from "@shared/config/urls.ts";
import { handleFetchChats } from "../model/actions.ts";

export class ChatWebsocket {
  private sockets = new Map<ChatId, WebSocket>();
  private heartbeats = new Map<ChatId, number>();

  public openWS(userId: number, chatId: ChatId, token: string) {
    /* close prev */
    this.closeWS(chatId);

    const ws = new WebSocket(`${WSS_CHATS}/${userId}/${chatId}/${token}`);
    this.sockets.set(chatId, ws);

    ws.addEventListener("open", () => {
      /* get history */
      ws.send(JSON.stringify({ type: "get old", content: "0" }));

      /* heartbeat every 30 secs */
      const timer = window.setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);

      this.heartbeats.set(chatId, timer);
    });

    ws.addEventListener(
      "message",
      (event): void | ApiResponse<string | ChatMessage | ChatMessage[]> => {
        try {
          const data = JSON.parse(event.data);

          if (Array.isArray(data)) {
            const history = (data as ChatMessage[]).sort(
              (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
            );
            this.setMessages(chatId, history);
            return { ok: true, data: history };
          }

          if (data?.type === "message") {
            const msg = data as ChatMessage;
            this.appendMessage(chatId, msg);
            return { ok: true, data: msg };
          }

          if (data?.type === "pong") return;

          if (data?.type === "error") {
            console.error("WS error:", data);
            return {
              ok: false,
              err: { status: 0, reason: "Network error", response: data },
            };
          }
        } catch (err) {
          console.error("WS parse error:", err);
          return {
            ok: false,
            err: {
              status: 0,
              reason: "Network error",
              response: typeof err === "string" ? err : "",
            },
          };
        }
      },
    );

    ws.addEventListener("close", () => {
      this.stopHeartbeat(chatId);
      /* todo: implement reconnection */
    });

    ws.addEventListener("error", (err) => {
      console.error("WS socket error:", err);
    });
  }

  public closeWS(chatId: ChatId) {
    const ws = this.sockets.get(chatId);

    if (ws) {
      ws.close(1000, "switch");
      this.sockets.delete(chatId);
    }

    this.stopHeartbeat(chatId);
  }

  private stopHeartbeat(chatId: ChatId) {
    const timer = this.heartbeats.get(chatId);

    if (timer) {
      window.clearInterval(timer);
      this.heartbeats.delete(chatId);
    }
  }

  public sendMessage(content: string) {
    const chatId = Store.getState().api.chats.activeId;

    if (!chatId) return;
    const ws = this.sockets.get(chatId);

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WS is not open");
      return;
    }

    ws.send(JSON.stringify({ type: "message", content }));

    /* update the chats list */
    setTimeout(() => handleFetchChats(), 100);
  }

  private setMessages(chatId: ChatId, messages: ChatMessage[]) {
    const all = Store.getState().api.chats.messagesByChatId || {};

    Store.set("api.chats.messagesByChatId", { ...all, [chatId]: messages });
  }

  private appendMessage(chatId: ChatId, message: ChatMessage) {
    const byChat = Store.getState().api.chats.messagesByChatId || {};
    const list = byChat[chatId] || [];

    this.setMessages(chatId, [...list, message]);
  }

  public sendFile(resourceId: number) {
    const chatId = Store.getState().api.chats.activeId;

    if (!chatId) return;
    const ws = this.sockets.get(chatId);

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WS is not open");
      return;
    }

    ws.send(JSON.stringify({ type: "file", content: String(resourceId) }));

    /* update the chats list */
    setTimeout(() => handleFetchChats(), 100);
  }
}
