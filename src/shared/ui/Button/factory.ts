/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseProps } from "@shared/lib/Component/model/base.types.ts";
import {
  ComponentDeps,
  ComponentId,
  ComponentNode,
  ComponentParams,
} from "../../lib/Component/model/types.ts";
import DOMService from "../../lib/DOM/DOMService.ts";
import FragmentService from "../../lib/Fragment/FragmentService.ts";
import { ComponentFactory } from "../../lib/helpers/factory/types.ts";
import { getSpinnerNode } from "../Spinner/factory.ts";
import css from "./button.module.css";
import { Button } from "./Button.ts";
import { ButtonProps, ButtonType } from "./types.ts";

export const getButtonNode = (
  id: ComponentId,
  i18nKey: string,
  {
    type,
    isSilent,
    i18nTooltipKey,
    on,
  }: {
    type?: ButtonType;
    isSilent?: boolean;
    i18nTooltipKey?: string;
    on?: BaseProps["on"];
  } = {},
): ComponentNode<ButtonProps, Button> => {
  const params = getButtonProps(id, i18nKey, type, i18nTooltipKey, isSilent, on);
  return {
    params,
    factory: buildButton,
    runtime: {
      instance: buildButton(params),
    },
  };
};

const getButtonProps = (
  id: ComponentId,
  i18nKey: string,
  type: ButtonType = "button",
  i18nTooltipKey: string = "",
  isSilent: boolean = false,
  on: BaseProps["on"],
): ComponentParams<ButtonProps> => {
  return {
    configs: {
      id,
      rootTag: "button",
      classNames: css.button,
      type,
      i18nKey,
      i18nTooltipKey,
      isSilent,
    },
    on,
    children: {
      nodes: {
        spinner: getSpinnerNode() as any,
      },
      edges: {
        spinner: "spinner",
      },
    },
  };
};

const buildButton: ComponentFactory<ButtonProps, Button> = (
  params: ComponentParams<ButtonProps>,
): Button => {
  const { id, rootTag } = params.configs;

  const deps: ComponentDeps<ButtonProps> = {
    domService: new DOMService(id, rootTag),
    fragmentService: new FragmentService(),
  };

  const node = {
    params,
    factory: buildButton,
  };

  return new Button({ deps, node });
};
