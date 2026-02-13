import { ZERO_WIDTH_SPACE } from "@/shared/config/const.ts";
import { ChatType } from "./types.ts";

export const getChatType = (title: string): ChatType => {
  if (title.includes(ZERO_WIDTH_SPACE)) return "notes";

  return "chat";
};
