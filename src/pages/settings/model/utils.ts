import { UserResponse } from "@shared/api/model/api.types.ts";
import { ApiResponse } from "@shared/api/model/types.ts";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import { GlobalEvent } from "@shared/lib/EventBus/events.ts";
import { ToastType } from "@shared/ui/Toast/types.ts";
import {
  handleUpdatePassword,
  handleUpdateProfile,
} from "@entities/user/model/actions.ts";
import { SettingsType } from "./types.ts";
import { i18n } from "@shared/i18n/I18nService.ts";

export const onGoodForm = (
  submitType: SettingsType,
): ((
  formData: Record<string, string>,
) => Promise<ApiResponse<Partial<UserResponse> | string>>) => {
  function dispatchToast(msg: string, type: ToastType = "info") {
    globalBus.emit(GlobalEvent.Toast, { msg, type });
  }

  if (submitType === "change-info") {
    const res = async (formData: Record<string, string>) => {
      const resApi = await handleUpdateProfile({
        first_name: formData.name,
        second_name: formData.surname,
        display_name: formData.display_name,
        login: formData.login,
        email: formData.email,
        phone: formData.phone,
      });

      if (resApi.ok) {
        dispatchToast(i18n.t("toasts.settings.changeSuccess"));
      } else {
        dispatchToast(resApi.err?.reason ?? "Unknown error", "error");
      }
      return resApi;
    };
    return res;
  }

  if (submitType === "change-password") {
    const res = async (formData: Record<string, string>) => {
      const resApi = await handleUpdatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (resApi.ok) {
        dispatchToast(i18n.t("toasts.settings.changePswSuccess"));
      } else {
        dispatchToast(
          i18n.t("toasts.settings.changePswErrorStub").replace('${}', resApi.err?.reason || ''),
          "error",
        );
      }

      return resApi;
    };

    return res;
  }

  return async () => {
    console.error("SettingsPage: Unknown submitType", submitType);
    return {
      ok: false,
      err: {
        status: 400,
        reason: "Unknown submitType",
        response: "Non-API response",
      },
    };
  };
};

export const onBadForm = (submitType: SettingsType): (() => void) => {
  if (submitType === "change-info") {
    return () => {
      globalBus.emit(GlobalEvent.Toast, {
        msg: i18n.t("toasts.validation.badForm"),
        type: "error",
      });
    };
  } else {
    return () => {
      globalBus.emit(GlobalEvent.Toast, {
        msg: i18n.t("toasts.validation.passwordError"),
        type: "error",
      });
    };
  }
};
