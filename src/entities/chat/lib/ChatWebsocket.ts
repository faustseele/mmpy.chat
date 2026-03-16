import Store from "@app/providers/store/model/Store.ts";
import { ChatId, ChatMessage } from "@shared/api/model/api.types";
import { WSS_CHATS } from "@shared/config/urls.ts";
import { handleFetchChats } from "../model/actions.ts";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import { GlobalEvent } from "@shared/lib/EventBus/events.ts";
import { sortMessagesByTime } from "../model/utils.ts";

export class ChatWebsocket {
  private _sockets = new Map<ChatId, WebSocket>();
  private _heartbeats = new Map<ChatId, number>();
  private _queuedMsgs = new Map<ChatId, (string | number)[]>();

  public openWS(userId: number, chatId: ChatId, token: string) {
    const socket = this._sockets.get(chatId);
    const open = socket && socket.readyState === WebSocket.OPEN;
    const connecting = socket && socket.readyState === WebSocket.CONNECTING;

    if (open || connecting) return;

    const ws = new WebSocket(`${WSS_CHATS}/${userId}/${chatId}/${token}`);
    this._sockets.set(chatId, ws);

    ws.addEventListener("open", () => {
      /* get history */
      ws.send(JSON.stringify({ type: "get old", content: "0" }));

      this._tryDispatchQueued();

      /* heartbeat every 30 secs */
      const timer = window.setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);

      this._heartbeats.set(chatId, timer);
    });

    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);

        if (Array.isArray(data) && data.length === 0) {
          this.setMessages(chatId, []);
          return;
        }

        const type = Array.isArray(data) ? data[0]?.type : data.type;

        const handleMsgsFiles = (data: ChatMessage | ChatMessage[]) => {
          if (Array.isArray(data)) {
            const history = sortMessagesByTime(data as ChatMessage[]);
            this.setMessages(chatId, history as ChatMessage[]);
          } else {
            this.setMessages(chatId, [data as ChatMessage]);
          }
        };

        switch (type) {
          case "message":
            handleMsgsFiles(data);
            break;
          case "file":
            handleMsgsFiles(data);
            break;
          case "pong":
            break;
          case "error":
            console.error("WS error:", data);
            break;
          default:
            console.error("Bad WS event.data:", data);
            break;
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    });

    ws.addEventListener("close", () => {
      this.stopHeartbeat(chatId);
      /* todo: implement reconnection */
    });

    ws.addEventListener("error", (err) => {
      console.error("WS socket error:", err);
    });
  }

  private _tryDispatchQueued() {
    const chats = this._queuedMsgs.keys();

    for (const chatId of chats) {
      const msgs = this._queuedMsgs.get(chatId);
      if (msgs) {
        msgs.forEach((msg) => this.sendMessage(chatId, msg));
      }
    }

    this._queuedMsgs.clear();
  }

  public closeWS(chatId: ChatId) {
    const ws = this._sockets.get(chatId);

    if (ws) {
      ws.close(1000, "switch");
      this._sockets.delete(chatId);
    }

    this.stopHeartbeat(chatId);
  }

  private stopHeartbeat(chatId: ChatId) {
    const timer = this._heartbeats.get(chatId);

    if (timer) {
      window.clearInterval(timer);
      this._heartbeats.delete(chatId);
    }
  }

  public sendMessage(chatId: ChatId, content: string | number) {
    const socket = this._sockets.get(chatId);
    if (!socket || !content) return;

    const type = typeof content === "string" ? "message" : "file";

    const pushToQueue = () => {
      const msgs = this._queuedMsgs.get(chatId);
      if (!msgs) this._queuedMsgs.set(chatId, [content]);
      else this._queuedMsgs.set(chatId, [...msgs, content]);
    };

    switch (socket.readyState) {
      case WebSocket.CONNECTING:
        pushToQueue();
        globalBus.emit(GlobalEvent.Toast, {
          msg: "Wait a moment, the connection is being established",
        });
        console.error("WS is connecting");
        return;
      case WebSocket.CLOSED:
        console.error("WS is closed");
        return;
      case WebSocket.CLOSING:
        console.error("WS is closing");
        return;
      default:
        break;
    }

    socket.send(JSON.stringify({ type, content }));

    /* update the chats list */
    setTimeout(() => handleFetchChats(), 100);
  }

  private setMessages(chatId: ChatId, newMsgs: ChatMessage[]) {
    const chatsWithMsgs = Store.getState().api.chats.messagesByChatId || {};
    const updMsgs = [...(chatsWithMsgs[chatId] || []), ...newMsgs];

    Store.set("api.chats.messagesByChatId", {
      ...chatsWithMsgs,
      [chatId]: updMsgs,
    });
  }

  public isOpen(chatId: ChatId): boolean {
    const ws = this._sockets.get(chatId);
    return !!ws && ws.readyState === WebSocket.OPEN;
  }
}
