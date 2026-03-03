import {
  BaseConfigs,
  BaseProps,
} from "../../lib/Component/model/base.types.ts";
import { RootTag } from "../../lib/DOM/types.ts";

export interface SubheadingConfigs extends BaseConfigs {
  rootTag: Extract<RootTag, "h2">;
  i18nKey: string;
  isDrama?: boolean;
}

export interface SubheadingProps extends BaseProps {
  configs: SubheadingConfigs;
}
