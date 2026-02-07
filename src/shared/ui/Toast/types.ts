import {
  BaseConfigs,
  BaseProps,
} from "../../lib/Component/model/base.types.ts";
import { RootTag } from "../../lib/DOM/types.ts";

export interface ToastProps extends BaseProps {
  configs: ToastConfigs;
}

interface ToastConfigs extends BaseConfigs {
  rootTag: Extract<RootTag, "span">;
  type: ToastType;
  msg: string;
  show: boolean;
  /* in ms */
  duration?: number;
}

export type ToastPayload = {
  msg: string;
  type: ToastType;
}

export type ToastType = "success" | "error" | "info";
