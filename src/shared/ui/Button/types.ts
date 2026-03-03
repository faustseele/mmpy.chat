import { ChildrenNodes } from "@shared/lib/Component/model/children.types.ts";
import {
  BaseConfigs,
  BaseProps,
} from "../../lib/Component/model/base.types.ts";
import { RootTag } from "../../lib/DOM/types.ts";

export interface ButtonProps extends BaseProps {
  configs: ButtonConfigs;
}

export interface ButtonConfigs extends BaseConfigs {
  rootTag: Extract<RootTag, "button">;
  classNames: string;
  type: ButtonType;
  i18nKey: string;
  i18nTooltipKey: string;
  isSilent?: boolean;
  showSpinner?: boolean;
}

export type ButtonType = "button" | "submit";

export type ButtonNodes = ChildrenNodes<"spinner">;
