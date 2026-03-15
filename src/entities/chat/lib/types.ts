import { ChatId, ChatMessage } from "@shared/api/model/api.types.ts";

/**
 * Payload interfaces for the event bus
 */
export interface ChatHistoryPayload {
  chatId: ChatId;
  messages: ChatMessage[];
}

export interface ChatMessagePayload {
  chatId: ChatId;
  message: ChatMessage;
}
