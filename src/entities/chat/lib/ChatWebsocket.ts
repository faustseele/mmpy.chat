import Store from "@app/providers/store/model/Store.ts";
import { ChatId, ChatMessage } from "@shared/api/model/api.types";
import { WSS_CHATS } from "@shared/config/urls.ts";
import { handleFetchChats } from "../model/actions.ts";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import { GlobalEvent } from "@shared/lib/EventBus/events.ts";

export class ChatWebsocket {
  private _sockets = new Map<ChatId, WebSocket>();
  private _heartbeats = new Map<ChatId, number>();
  private _queuedMsgsByChats = new Map<ChatId, ChatMessage[]>();

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

        if (Array.isArray(data)) {
          const history = (data as ChatMessage[]).sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
          );
          this.setMessages(chatId, history);
        }

        if (data?.type === "message") {
          const msg = data as ChatMessage;
          this.appendMessage(chatId, msg);
        }

        if (data?.type === "pong") return;

        if (data?.type === "error") {
          console.error("WS error:", data);
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

    this._tryDispatchQueued();
  }

  private _tryDispatchQueued() {
    const chats = this._queuedMsgsByChats.keys();

    for (const chatId of chats) {
      const msgs = this._queuedMsgsByChats.get(chatId);
      if (msgs) {
        msgs.forEach((msg) => this.sendMessage(chatId, msg.content));
      }
    }
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

  public sendMessage(chatId: ChatId, content: string) {
    const socket = this._sockets.get(chatId);
    if (!socket || !content) return;

    switch (socket.readyState) {
      case WebSocket.CONNECTING:
        globalBus.emit(GlobalEvent.Toast, {
          msg: "Wait a moment, the connection is being established",
        });
        console.error("WS is connecting");
        return;
      case WebSocket.CLOSED:
      case WebSocket.CLOSING:
        return;
      default:
        break;
    }

    this._tryDispatchQueued();

    socket.send(JSON.stringify({ type: "message", content }));

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

  public sendFile(chatId: ChatId, resourceId: number) {
    const ws = this._sockets.get(chatId);

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WS is not open");
      return;
    }

    ws.send(JSON.stringify({ type: "file", content: String(resourceId) }));

    /* update the chats list */
    setTimeout(() => handleFetchChats(), 100);
  }

  public isOpen(chatId: ChatId): boolean {
    const ws = this._sockets.get(chatId);
    return !!ws && ws.readyState === WebSocket.OPEN;
  }
}
