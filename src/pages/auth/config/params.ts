/* eslint-disable @typescript-eslint/no-explicit-any */
import { cx } from "@shared/lib/helpers/formatting/classnames.ts";
import { getButtonNode } from "@shared/ui/Button/factory.ts";
import { getHeadingNode } from "@shared/ui/Heading/factory.ts";
import { getInputNode } from "@shared/ui/Input/factory.ts";
import { RouteConfigs } from "@app/providers/router/types.ts";
import { PageId } from "@pages/page/config/const.ts";
import { PageNode } from "@pages/page/model/types.ts";
import cssPage from "@pages/page/ui/page.module.css";
import { ROOT_QUERY } from "@shared/config/dom.ts";
import { ComponentParams } from "@shared/lib/Component/model/types.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { handleReroute } from "../model/actions.ts";
import { buildAuthPage } from "../model/factory.ts";
import { AuthProps } from "../model/types.ts";
import type { AuthPage } from "../ui/AuthPage.ts";
import css from "../ui/auth.module.css";
import { i18n } from "@shared/i18n/I18nService.ts";

const iptIds = [
  "input-name",
  "input-surname",
  "input-login",
  "input-email",
  "input-password",
  "input-phone",
];

const inputs_signUp = {
  "input-name": getInputNode(
    iptIds[0],
    "name",
    "auth.inputs.name.label",
  ),
  "input-surname": getInputNode(
    iptIds[1],
    "surname",
    "auth.inputs.surname.label",
  ),
  "input-login": getInputNode(
    iptIds[2],
    "login",
    "auth.inputs.login.label",
  ),
  "input-email": getInputNode(
    iptIds[3],
    "email",
    "auth.inputs.email.label",
  ),
  "input-password": getInputNode(
    iptIds[4],
    "password",
    "auth.inputs.password.label",
  ),
  "input-phone": getInputNode(
    iptIds[5],
    "phone",
    "auth.inputs.phone.label",
  ),
};

const inputs_signIn = {
  "input-login": getInputNode(
    iptIds[2],
    "login",
    "auth.inputs.login.label",
  ),
  "input-password": getInputNode(
    iptIds[4],
    "password",
    "auth.inputs.password.label",
  ),
};

const authPageParams_signIn: ComponentParams<AuthProps> = {
  configs: {
    id: PageId.SignIn,
    rootTag: "form",
    classNames: cx(cssPage.moduleWindow, css.moduleWindow_auth),
    type: "sign-in",
  },
  children: {
    nodes: {
      ...(inputs_signIn as any),
      heading: getHeadingNode("heading", "auth.signin.heading"),
      buttonLanguage: getButtonNode("buttonLanguage", "langSwitch", {
        type: "button",
        on: {
          click: () => i18n.cycleLanguages(),
        },
      }),
      buttonFormSubmit: getButtonNode(
        "buttonFormSubmit",
        "auth.signin.submit",
        {
          type: "submit",
        },
      ),
      buttonGuest: getButtonNode("buttonGuest", "auth.signin.guest"),
      buttonReroute: getButtonNode(
        "buttonReroute",
        "auth.signin.newHere",
        {
          isSilent: true,
          on: {
            click: () => handleReroute("sign-in"),
          },
        },
      ),
    },
    edges: {
      heading: "heading",
      buttonLanguage: "buttonLanguage",
      buttonFormSubmit: "buttonFormSubmit",
      buttonGuest: "buttonGuest",
      buttonReroute: "buttonReroute",
      inputs: ["input-login", "input-password"],
    },
  },
};

const authPageParams_signUp: ComponentParams<AuthProps> = {
  configs: {
    id: PageId.SignUp,
    rootTag: "form",
    classNames: cx(cssPage.moduleWindow, css.moduleWindow_auth),
    type: "sign-up",
  },
  children: {
    nodes: {
      ...(inputs_signUp as any),
      heading: getHeadingNode("heading", "auth.signup.heading"),
      buttonLanguage: getButtonNode("buttonLanguage", "langSwitch", {
        type: "button",
        on: {
          click: () => i18n.cycleLanguages(),
        },
      }),
      buttonFormSubmit: getButtonNode(
        "buttonFormSubmit",
        "auth.signup.submit",
        {
          type: "submit",
        },
      ),
      buttonGuest: getButtonNode("buttonGuest", "auth.signup.guest"),
      buttonReroute: getButtonNode(
        "buttonReroute",
        "auth.signup.haveAccount",
        {
          isSilent: true,
          on: {
            click: () => handleReroute("sign-up"),
          },
        },
      ),
    },
    edges: {
      heading: "heading",
      buttonLanguage: "buttonLanguage",
      buttonFormSubmit: "buttonFormSubmit",
      buttonGuest: "buttonGuest",
      buttonReroute: "buttonReroute",
      inputs: [
        "input-name",
        "input-surname",
        "input-login",
        "input-email",
        "input-password",
        "input-phone",
      ],
    },
  },
};

export const authPageNode_in: PageNode<AuthProps, AuthPage> = {
  params: authPageParams_signIn,
  factory: buildAuthPage as any,
};

export const authPageNode_up: PageNode<AuthProps, AuthPage> = {
  params: authPageParams_signUp,
  factory: buildAuthPage as any,
};

export const signUpRouteConfig: RouteConfigs = {
  path: RouteLink.SignUp,
  rootQuery: ROOT_QUERY,
  authStatus: "guest",
  params: {},
};

export const signInRouteConfig: RouteConfigs = {
  path: RouteLink.SignIn,
  rootQuery: ROOT_QUERY,
  authStatus: "guest",
  params: {},
};
