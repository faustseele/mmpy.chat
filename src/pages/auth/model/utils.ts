import { UserResponse } from "@/shared/api/model/api.types.ts";
import { ApiResponse } from "@/shared/api/model/types.ts";
import { globalBus } from "@/shared/lib/EventBus/EventBus.ts";
import { SubmitTypes } from "@/shared/lib/validation/types.ts";
import {
  handleSignIn,
  handleSignUp,
} from "@features/authenticate/model/actions.ts";

const emitToast = (res: ApiResponse<UserResponse>, type: SubmitTypes) => {
  /* guard clause */
  if (!res.ok) {
    const err = res.err;
    const msg = `${err?.reason}`;
    globalBus.emit("toast", { msg: msg, type: "error" });
    return;
  }

  if (type === "sign-up") {
    globalBus.emit("toast", {
      msg: "Account created successfully.",
      type: "success",
    });
    return;
  }

  if (type === "sign-in") {
    globalBus.emit("toast", {
      msg: "Welcome back!",
      type: "success",
    });
    return;
  }

  globalBus.emit("toast", {
    msg: "Developer error: unhandled condition.",
    type: "error",
  });
  console.error("AuthPage: unhandled condition.", this);
};

export const onBadForm = (msg?: string) => {
  globalBus.emit("toast", {
    msg: msg ?? "Please fill all the fields correctly.",
    type: "error",
  });
};

export const onGoodForm = (
  submitType: SubmitTypes,
): ((
  formData: Record<string, string>,
) => Promise<ApiResponse<UserResponse>>) => {
  if (submitType === "sign-in") {
    return async (formData: Record<string, string>) => {
      const res = await handleSignIn({
        login: formData.login,
        password: formData.password,
      });

      emitToast(res, submitType);
      return res;
    };
  }

  if (submitType === "sign-up") {
    return async (formData: Record<string, string>) => {
      const res = await handleSignUp({
        first_name: formData.name,
        second_name: formData.surname,
        login: formData.login,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      emitToast(res, submitType);
      return res;
    };
  }

  return async () => {
    console.error("AuthPage: Unknown submitType", submitType);
    return {
      ok: false,
      err: {
        status: 400,
        reason: "Bad submitType",
        response: "Non-API response",
      },
    };
  };
};
