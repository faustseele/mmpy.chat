import {
  BaseConfigs,
  BaseProps,
} from "../../lib/Component/model/base.types.ts";
import { RootTag } from "../../lib/DOM/types.ts";

export interface HeadingProps extends BaseProps {
  configs: HeadingConfigs;
}

export interface HeadingConfigs extends BaseConfigs {
  rootTag: Extract<RootTag, "h1">;
  i18nKey: string;
  isClickable?: boolean;
  isDrama?: boolean;
}

export interface HeadingOn {
  click?: () => unknown;
}
