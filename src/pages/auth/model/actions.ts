import Router from "@/app/providers/router/Router.ts";
import { Button } from "@/shared/ui/Button/Button.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { AuthType } from "./types.ts";
import { handleGuestSignIn } from "@/features/authenticate/model/actions.ts";

export const handleReroute = (type: AuthType): void => {
  Router.go(type === "sign-up" ? RouteLink.SignIn : RouteLink.SignUp);
};

export const handleGuestClick = async (btn: Button) => {
  btn.setProps({
    configs: {
      showSpinner: true,
    },
  });

  await handleGuestSignIn();

  btn.setProps({
    configs: {
      showSpinner: false,
    },
  });
};
