import { UserResponse } from "@shared/api/model/api.types.ts";
import { ApiResponse } from "@shared/api/model/types.ts";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import { GlobalEvent } from "@shared/lib/EventBus/events.ts";
import Router from "@app/providers/router/Router.ts";
import Store from "@app/providers/store/model/Store.ts";
import {
  handleCreateChat,
  handleFetchChats,
  hardResetMessenger,
} from "@entities/chat/model/actions.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { ls_setGuestMode } from "@shared/lib/LocalStorage/actions.ts";
import AuthService from "./AuthService.ts";
import { i18n } from "@shared/i18n/I18nService.ts";
import { SignInData, SignUpData } from "./types.ts";
import ChatService from "@entities/chat/model/ChatService.ts";

export const handleFetchUser = async (): Promise<ApiResponse<UserResponse>> => {
  const res = await AuthService.fetchUser();

  if (!res.ok) {
    const status = res.err?.status;

    if (status === 408) {
      globalBus.emit(GlobalEvent.Toast, {
        msg: i18n.t("toasts.auth.timeout"),
        type: "error",
      });
      return res;
    }

    if (status === 401) {
      handlePresentSession(res);
      return res;
    }

    console.warn("Unhandled Error-response", res);

    return res;
  }

  return res;
};

export const handleLogout = async (
  noToast = false,
): Promise<ApiResponse<boolean>> => {
  globalBus.emit(GlobalEvent.Toast, { msg: i18n.t("toasts.auth.loggingOut") });

  /* closing all sockets */
  ChatService.onLogout()

  /* cleanup on guest mode */
  const isGuest = Store.getState().controllers.isGuestMode;
  if (isGuest) {
    await hardResetMessenger();
    Store.set("controllers.isGuestMode", false);
    ls_setGuestMode(false);
  }

  const res = await AuthService.logout();
  
  if (res.ok) {
    Router.go(RouteLink.SignIn);
    if (!noToast) {
      globalBus.emit(GlobalEvent.Toast, {
        msg: i18n.t("toasts.auth.logoutSuccess"),
        type: "success",
      });
    }
  } else {
    Router.go(RouteLink.Error);
    console.error("Logout Failed", res);
    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n
        .t("toasts.chats.devErrorStub")
        .replace("${}", res.err?.reason || ""),
      type: "error",
    });
  }
  return res;
};

export const handlePresentSession = async (res: ApiResponse<UserResponse>) => {
  const reason = res.err?.reason;

  if (reason === "User already in system") {
    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n.t("toasts.auth.alreadyLogged"),
      type: "info",
    });

    Router.go(RouteLink.Settings);
    return;
  }

  if (reason === "Cookie is not valid") {
    /* straight logout & cookie removal; bypassing full handleLogout() */
    await handleLogout(true);

    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n.t("toasts.auth.invalidSession"),
      type: "error",
    });

    return;
  }

  console.warn("Unhandled Error-response", res);
};

export const handleSignUp = async (
  data: SignUpData,
): Promise<ApiResponse<UserResponse>> => {
  const res = await AuthService.signUp(data);

  /* globalToast is handles in onGood/BadForm in auth-utils */
  if (res.ok) {
    /* fetch chats on successful signup */
    Router.go(RouteLink.Messenger);

    /* generating one notes-chat */
    handleCreateChat("Заметки 📃", true);
  }

  return res;
};

export const handleSignIn = async (
  data: SignInData,
): Promise<ApiResponse<UserResponse>> => {
  const res = await AuthService.signIn(data);

  /* globalToast is handles in onGood/BadForm in auth-utils */
  if (res.ok) {
    /* fetch chats on successful login */
    handleFetchChats();
    Router.go(RouteLink.Messenger);
    Store.set("controllers.isGuestMode", false);
    ls_setGuestMode(false);
  } else {
    if (res.err?.status === 400) handlePresentSession(res);
  }
  return res;
};
