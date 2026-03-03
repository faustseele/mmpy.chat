import {
  BaseConfigs,
  BaseProps,
} from "../../lib/Component/model/base.types.ts";
import { RootTag } from "../../lib/DOM/types.ts";

export interface InputProps extends BaseProps {
  /* Configurations are used for <input> tag inside <label>-wrapper */
  configs: InputConfigs;
  on?: BaseProps["on"];
}

export interface InputConfigs extends BaseConfigs {
  rootTag: Extract<RootTag, "label">;
  fieldId: FieldType;
  i18nLabelKey: string;
  type: InputType;
  i18nPlaceholderKey: string;
  for: FieldType;
  isError?: boolean;
  errorMessage?: string;
  autocomplete?: "on" | "off";
}

export type InputType = "text" | "email" | "password" | "tel";

export type FieldType =
  | "name"
  | "surname"
  | "login"
  | "email"
  | "password"
  | "phone"
  | "display_name"
  | "search"
  | "message"
  | "oldPassword"
  | "newPassword";
