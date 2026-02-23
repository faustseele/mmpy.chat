import { ls_getLocale, ls_getLoggedIn } from "@shared/lib/LocalStorage/actions.ts";
import { AppState } from "../model/Store.ts";
import { APIState } from "../model/types.ts";

const apiInitialState: APIState = {
  auth: {
    user: null,
  },
  chats: {
    activeId: null,
    currentChat: null,
    list: null,
    messagesByChatId: {},
    wsStatus: "idle",
  },
};

export const initialState: AppState = {
  api: apiInitialState,
  controllers: {
    language: ls_getLocale(),
    isLoggedIn: ls_getLoggedIn(),
  },
  pageNodes: {},
};
