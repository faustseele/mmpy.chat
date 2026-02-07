import {
  ComponentDeps,
  ComponentNode,
  ComponentParams,
} from "@/shared/lib/Component/model/types.ts";
import DOMService from "@/shared/lib/DOM/DOMService.ts";
import FragmentService from "@/shared/lib/Fragment/FragmentService.ts";
import { ComponentFactory } from "@/shared/lib/helpers/factory/types.ts";
import css from "./toast.module.css";
import { Toast } from "./Toast.ts";
import { ToastProps, ToastType } from "./types.ts";

export const getToastNode = (
  msg: string,
  type: ToastType = "info",
  duration: number = 2000,
): ComponentNode<ToastProps> => {
  const params: ComponentParams<ToastProps> = {
    configs: {
      id: "toast",
      rootTag: "span",
      show: false,
      classNames: css.toast,
      msg,
      type,
      duration,
    },
  };
  return {
    params,
    factory: buildToast,
    runtime: {
      instance: buildToast(params),
    },
  };
};

const buildToast: ComponentFactory<ToastProps, Toast> = (
  params: ComponentParams<ToastProps>,
): Toast => {
  const { id, rootTag } = params.configs;

  const deps: ComponentDeps<ToastProps> = {
    domService: new DOMService(id, rootTag),
    fragmentService: new FragmentService(),
  };

  const node: ComponentNode<ToastProps, Toast> = {
    params,
    factory: buildToast,
  };

  return new Toast({ deps, node });
};
