import { UserResponse } from "@shared/api/model/api.types.ts"
import { ApiResponse } from "@shared/api/model/types.ts";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import Router from "@app/providers/router/Router.ts";
import {
  handleCreateChat,
  handleFetchChats,
} from "@entities/chat/model/actions.ts";
import { RouteLink } from "@shared/types/universal.ts";
import AuthService from "./AuthService.ts";
import { i18n } from "@shared/i18n/I18nService.ts";
import { SignInData, SignUpData } from "./types.ts";

export const handleFetchUser = async (): Promise<ApiResponse<UserResponse>> => {
  const res = await AuthService.fetchUser();

  if (!res.ok) {
    const status = res.err?.status;

    if (status === 408) {
      globalBus.emit("toast", {
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
  } else {
    if (res.err?.status === 400) handlePresentSession(res);
  }
  return res;
};

export const handlePresentSession = async (res: ApiResponse<UserResponse>) => {
  const reason = res.err?.reason;

  if (reason === "User already in system") {
    globalBus.emit("toast", {
      msg: i18n.t("toasts.auth.alreadyLogged"),
      type: "info",
    });

    Router.go(RouteLink.Settings);
    return;
  }

  if (reason === "Cookie is not valid") {
    /* straight logout & cookie removal; bypassing full handleLogout() */
    await AuthService.logout();

    globalBus.emit("toast", {
      msg: i18n.t("toasts.auth.invalidSession"),
      type: "error",
    });

    Router.go(RouteLink.SignIn);
    return;
  }

  console.warn("Unhandled Error-response", res);
};

export const handleLogout = async (): Promise<ApiResponse<boolean>> => {
  globalBus.emit("toast", { msg: i18n.t("toasts.auth.loggingOut") });

  const res = await AuthService.logout();
  if (res.ok) {
    Router.go(RouteLink.SignIn);
    globalBus.emit("toast", {
      msg: i18n.t("toasts.auth.logoutSuccess"),
      type: "success",
    });
  } else {
    Router.go(RouteLink.Error);
    console.error("Logout Failed", res);
    globalBus.emit("toast", {
      msg: i18n.t("toasts.dev.devErrorStub") + res.err?.reason,
      type: "error",
    });
  }
  return res;
};
