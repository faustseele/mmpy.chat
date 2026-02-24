import Router from "@app/providers/router/Router.ts";
import { handleFetchChats } from "@entities/chat/model/actions.ts";
import { UserResponse } from "@shared/api/model/api.types.ts";
import { ApiResponse } from "@shared/api/model/types.ts";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { GUEST_CREDS } from "../config/guest.ts";
import { handlePresentSession } from "./actions.ts";
import AuthService from "./AuthService.ts";
import { i18n } from "@shared/i18n/I18nService.ts";

export const handleGuestSignIn = async (): Promise<
  ApiResponse<UserResponse>
> => {
  globalBus.emit("toast", { msg: i18n.t("toasts.auth.guestLoading") });
  const res = await AuthService.signIn(GUEST_CREDS);

  if (res.ok) {
    /* fetch chats on successful login */
    handleFetchChats();
    Router.go(RouteLink.Messenger);
    globalBus.emit("toast", {
      msg: i18n.t("toasts.auth.guestSuccess"),
      type: "success",
    });
  } else {
    if (res.err?.status === 400) handlePresentSession(res);

    console.error("Guest Login Failed", res);
    globalBus.emit("toast", {
      msg: i18n.t("toasts.dev.devErrorStub").replace('${}', res.err?.reason || ''),
      type: "error",
    });
  }
  return res;
};
