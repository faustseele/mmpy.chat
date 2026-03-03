/* eslint-disable @typescript-eslint/no-explicit-any */
import { cx } from "@shared/lib/helpers/formatting/classnames.ts";
import { getButtonNode } from "@shared/ui/Button/factory.ts";
import { getHeadingNode } from "@shared/ui/Heading/factory.ts";
import { getSubheadingNode } from "@shared/ui/Subheading/factory.ts";
import { RouteConfigs } from "@app/providers/router/types.ts";
import { PageId } from "@pages/page/config/const.ts";
import cssPage from "@pages/page/ui/page.module.css";
import { ROOT_QUERY } from "@shared/config/dom.ts";
import { ComponentParams } from "@shared/lib/Component/model/types.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { handleBack } from "../model/actions.ts";
import { ErrorProps } from "../model/types.ts";
import css from "../ui/errors.module.css";
export const errorPageParams_404: ComponentParams<ErrorProps> = {
  configs: {
    id: PageId.Error404,
    rootTag: "div",
    classNames: cx(cssPage.moduleWindow, css.moduleWindow_errors),
    code: "404",
  },
  children: {
    nodes: {
      heading: getHeadingNode("heading", "errors.404.heading", {
        isDrama: true,
      }) as any,
      subheading: getSubheadingNode("subheading", "errors.404.subheading", {
        isDrama: true,
      }) as any,
      button_back: getButtonNode("button_back", "errors.404.back", {
        on: { click: handleBack },
      }) as any,
    },
    edges: {
      heading: "heading",
      subheading: "subheading",
      button_back: "button_back",
    },
  },
};

export const errorPageParams_500: ComponentParams<ErrorProps> = {
  configs: {
    id: PageId.Error500,
    rootTag: "div",
    classNames: cx(cssPage.moduleWindow, css.moduleWindow_errors),
    code: "500",
  },
  children: {
    nodes: {
      heading: getHeadingNode("heading", "errors.500.heading", {
        isDrama: true,
      }) as any,
      subheading: getSubheadingNode("subheading", "errors.500.subheading", {
        isDrama: true,
      }) as any,
      button_back: getButtonNode("button_back", "errors.500.back", {
        on: { click: handleBack },
      }) as any,
    },
    edges: {
      heading: "heading",
      subheading: "subheading",
      button_back: "button_back",
    },
  },
};

export const errorRouteConfig_404: RouteConfigs = {
  path: RouteLink.NotFound,
  rootQuery: ROOT_QUERY,
  authStatus: "any",
  params: {},
};

export const errorRouteConfig_500: RouteConfigs = {
  path: RouteLink.Error,
  rootQuery: ROOT_QUERY,
  authStatus: "any",
  params: {},
};
