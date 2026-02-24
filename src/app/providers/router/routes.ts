import Router from "@app/providers/router/Router.ts";
import {
  signInRouteConfig,
  signUpRouteConfig,
} from "@pages/auth/config/params.ts";
import {
  createAuthPage_signIn,
  createAuthPage_signUp,
} from "@pages/auth/model/factory.ts";

import {
  errorRouteConfig_404,
  errorRouteConfig_500,
} from "@pages/errors/config/params.ts";
import {
  createErrorPage_404,
  createErrorPage_500,
} from "@pages/errors/model/factory.ts";

import { messengerPageRouteConfig } from "@pages/messenger/config/params.ts";
import { createMessengerPage } from "@pages/messenger/model/factory.ts";

import { settingsPageRouteConfig } from "@pages/settings/config/params.ts";
import { createSettingsPage } from "@pages/settings/model/factory.ts";

export function registerRoutes() {
  Router
    /* SignIn route */
    .use(signInRouteConfig, createAuthPage_signIn)
    /* SignUp route */
    .use(signUpRouteConfig, createAuthPage_signUp)
    /* Messenger route */
    .use(messengerPageRouteConfig, createMessengerPage)
    /* Settings route */
    .use(settingsPageRouteConfig, createSettingsPage)
    /* NotFound route */
    .use(errorRouteConfig_404, createErrorPage_404)
    /* Error route */
    .use(errorRouteConfig_500, createErrorPage_500);
}
