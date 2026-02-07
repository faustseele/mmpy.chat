import { UserResponse } from "@/shared/api/model/api.types.ts";
import { ApiResponse } from "@/shared/api/model/types.ts";
import { globalBus } from "@/shared/lib/EventBus/EventBus.ts";
import { ToastType } from "@/shared/ui/Toast/types.ts";
import {
  handleUpdatePassword,
  handleUpdateProfile,
} from "@entities/user/model/actions.ts";
import { SettingsType } from "./types.ts";

export const onGoodForm = (
  submitType: SettingsType,
): ((
  formData: Record<string, string>,
) => Promise<ApiResponse<Partial<UserResponse> | string>>) => {
  function dispatchToast(msg: string, type: ToastType = "info") {
    globalBus.emit("toast", { msg, type });
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
        dispatchToast("Your profile has been changed successfully.");
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
        dispatchToast("Your password has been changed successfully.");
      } else {
        dispatchToast(
          "Your password could not be changed. API: " + resApi.err?.reason,
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
      globalBus.emit("toast", {
        msg: "The field seems incorrect.",
        type: "error",
      });
    };
  } else {
    return () => {
      globalBus.emit("toast", {
        msg: "Either the old is incorrect or the new password is not valid.",
        type: "error",
      });
    };
  }
};
