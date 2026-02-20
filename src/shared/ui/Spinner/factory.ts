import {
  ComponentDeps,
  ComponentNode,
  ComponentParams,
} from "@shared/lib/Component/model/types.ts";
import DOMService from "@shared/lib/DOM/DOMService.ts";
import FragmentService from "@shared/lib/Fragment/FragmentService.ts";
import { ComponentFactory } from "@shared/lib/helpers/factory/types.ts";
import css from "./spinner.module.css";
import { Spinner } from "./Spinner.ts";
import { SpinnerProps } from "./types.ts";
import { cx } from "@shared/lib/helpers/formatting/classnames.ts";

export const getSpinnerNode = (
  isBig: boolean = false,
): ComponentNode<SpinnerProps> => {
  const params: ComponentParams<SpinnerProps> = {
    configs: {
      id: "spinner",
      rootTag: "span",
      isBig,
      isOn: true,
      classNames: cx(css.spinner, css.spinner_on),
    },
  };

  return {
    params,
    factory: buildSpinner,
    runtime: {
      instance: buildSpinner(params),
    },
  };
};

const buildSpinner: ComponentFactory<SpinnerProps, Spinner> = (
  params: ComponentParams<SpinnerProps>,
): Spinner => {
  const { id, rootTag } = params.configs;

  const deps: ComponentDeps<SpinnerProps> = {
    domService: new DOMService(id, rootTag),
    fragmentService: new FragmentService(),
  };

  const node = {
    params,
    factory: buildSpinner,
  };

  return new Spinner({ deps, node });
};
