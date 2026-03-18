import Router from "@app/providers/router/Router.ts";
import Store from "@app/providers/store/model/Store.ts";
import {
  handleAddUser,
  handleCreateChat,
  handleFetchChats,
  handleUpdateChatAvatar,
  hardResetMessenger,
} from "@entities/chat/model/actions.ts";
import UserService from "@entities/user/model/UserService.ts";
import { UserResponse } from "@shared/api/model/api.types.ts";
import { ApiResponse } from "@shared/api/model/types.ts";
import { ZERO_WIDTH_SPACE } from "@shared/config/const.ts";
import { API_URL_RESOURCES } from "@shared/config/urls.ts";
import { i18n } from "@shared/i18n/I18nService.ts";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import { GlobalEvent } from "@shared/lib/EventBus/events.ts";
import { ls_setGuestMode } from "@shared/lib/LocalStorage/actions.ts";
import { downloadFile } from "@shared/lib/helpers/file.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { GUEST_CREDS } from "../config/guest.ts";
import { handlePresentSession } from "./actions.ts";
import AuthService from "./AuthService.ts";

const GUEST_STARTER_NOTES = [
  "messenger.notes.study",
  "messenger.notes.dailyPlan",
] as const;

const GUEST_STARTER_USERS = ["liamgarcia", "emmawilson"] as const;

export const handleGuestSignIn = async (): Promise<
  ApiResponse<UserResponse>
> => {
  globalBus.emit(GlobalEvent.Toast, {
    msg: i18n.t("toasts.auth.guestLoading"),
  });
  const res = await AuthService.signIn(GUEST_CREDS);

  if (res.ok) {
    /* fetch chats on successful login */
    await handleFetchChats();
    Router.go(RouteLink.Messenger);
    Store.set("controllers.isGuestMode", true);
    ls_setGuestMode(true);
    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n.t("toasts.auth.guestSuccess"),
      type: "success",
    });

    /* bootstrap runs after navigation — non-blocking ux */
    bootstrapGuestStarter();
  } else {
    const status = res.err?.status;
    if (status === 400 || status === 401) {
      handlePresentSession(res);
    } else {
      console.error("guest sign-in failed", res);
      globalBus.emit(GlobalEvent.Toast, {
        msg: i18n.t("toasts.auth.guestError"),
        type: "error",
      });
    }
  }
  return res;
};

const bootstrapGuestStarter = async (): Promise<void> => {
  globalBus.emit(GlobalEvent.Toast, {
    msg: i18n.t("toasts.auth.guestResetting"),
  });

  /* wipe all existing chats & notes */
  await hardResetMessenger();

  /* seed test notes */
  for (const noteKey of GUEST_STARTER_NOTES) {
    const title = i18n.t(noteKey) + ZERO_WIDTH_SPACE;
    await handleCreateChat(title, true, true, true);
  }

  /* seed test convos */
  for (const login of GUEST_STARTER_USERS) {
    const resUser = await UserService.findByLogin(login);
    if (!resUser.ok || !resUser.data) {
      console.error(`bootstrapGuestStarter: user ${login} not found`, resUser);
      continue;
    }

    const user = resUser.data;
    const chatTitle = `${user.first_name} ${user.second_name}`;
    const resChat = await handleCreateChat(chatTitle, true, true, true);

    if (resChat.ok && resChat.data) {
      const chatId = resChat.data.id;
      await handleAddUser(chatId, user.id);

      const avatarUrl = user.avatar;
      if (avatarUrl) {
        const avatar = await downloadFile(`${API_URL_RESOURCES}${avatarUrl}`);
        handleUpdateChatAvatar(resChat.data.id, avatar);
      }
    }
  }

  /* re-fetch to update sidebar */
  await handleFetchChats();

  globalBus.emit(GlobalEvent.Toast, {
    msg: i18n.t("toasts.auth.guestSuccess"),
    type: "success",
  });
};
