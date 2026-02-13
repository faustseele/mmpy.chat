import { UserResponse } from "@/shared/api/model/api.types.ts";
import { ApiResponse } from "@/shared/api/model/types.ts";
import { globalBus } from "@/shared/lib/EventBus/EventBus.ts";
import Router from "@app/providers/router/Router.ts";
import {
  handleCreateChat,
  handleFetchChats,
} from "@entities/chat/model/actions.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { GUEST_CREDS } from "../config/guest.ts";
import AuthService from "./AuthService.ts";
import { SignInData, SignUpData } from "./types.ts";

export const handleFetchUser = async (): Promise<ApiResponse<UserResponse>> => {
  const res = await AuthService.fetchUser();

  if (!res.ok && res.err?.status === 408) {
    globalBus.emit("toast", {
      msg: "Request Timeout. Try Again.",
      type: "error",
    });
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

export const handleGuestSignIn = async (): Promise<
  ApiResponse<UserResponse>
> => {
  globalBus.emit("toast", { msg: "Launching Guest Mode..." });
  const res = await AuthService.signIn(GUEST_CREDS);

  if (res.ok) {
    /* fetch chats on successful login */
    handleFetchChats();
    Router.go(RouteLink.Messenger);
    globalBus.emit("toast", {
      msg: "👻 Guest Login Success!",
      type: "success",
    });
  } else {
    if (res.err?.status === 400) handlePresentSession(res);

    console.error("Guest Login Failed", res);
    globalBus.emit("toast", {
      msg: res.err?.reason,
      type: "error",
    });
  }
  return res;
};

export const handlePresentSession = async (res: ApiResponse<UserResponse>) => {
  if (res.err?.reason === "User already in system") {
    await handleLogout();
    globalBus.emit("toast", {
      msg: "Another session is active, logging out. Try again.",
      type: "error",
    });
  }
};

export const handleLogout = async (): Promise<ApiResponse<boolean>> => {
  globalBus.emit("toast", { msg: "Logging out..." });

  const res = await AuthService.logout();
  if (res.ok) {
    Router.go(RouteLink.SignIn);
    globalBus.emit("toast", {
      msg: "👋 See you!",
      type: "success",
    });
  } else {
    Router.go(RouteLink.Error);
    console.error("Logout Failed", res);
    globalBus.emit("toast", {
      msg: res.err?.reason,
      type: "error",
    });
  }
  return res;
};
