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
  text: string,
  {
    type,
    isSilent,
    tooltip,
    on,
  }: {
    type?: ButtonType;
    isSilent?: boolean;
    tooltip?: string;
    on?: BaseProps["on"];
  } = {},
): ComponentNode<ButtonProps> => {
  const params = getButtonProps(id, text, type, tooltip, isSilent, on);
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
  text: string,
  type: ButtonType = "button",
  tooltip: string = "",
  isSilent: boolean = false,
  on: BaseProps["on"],
): ComponentParams<ButtonProps> => {
  return {
    configs: {
      id,
      rootTag: "button",
      classNames: css.button,
      type,
      text,
      tooltip,
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
