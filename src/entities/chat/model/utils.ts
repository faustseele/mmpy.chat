import { ChatMessage } from "@shared/api/model/api.types.ts";
import { ZERO_WIDTH_SPACE } from "@shared/config/const.ts";
import { ChatType } from "./types.ts";

export const getChatType = (title: string): ChatType => {
  if (title.includes(ZERO_WIDTH_SPACE)) return "notes";

  return "chat";
};

export const sortMessagesByTime = (msgs: ChatMessage[]): ChatMessage[] => {
  return (msgs as ChatMessage[]).sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  );
};
