import { BaseProps } from "../../lib/Component/model/base.types.ts";
import {
  ComponentDeps,
  ComponentId,
  ComponentNode,
  ComponentParams,
} from "../../lib/Component/model/types.ts";
import DOMService from "../../lib/DOM/DOMService.ts";
import FragmentService from "../../lib/Fragment/FragmentService.ts";
import { ComponentFactory } from "../../lib/helpers/factory/types.ts";
import css from "./input.module.css";
import { Input } from "./Input.ts";
import { FieldType, InputProps } from "./types.ts";
import { getInputTypeByFieldId } from "./utils.ts";

export const getInputNode = (
  id: ComponentId,
  fieldId: FieldType,
  i18nLabelKey: string,
  {
    i18nPlaceholderKey,
    isError,
    errorMessage,
    autocomplete,
    on,
  }: {
    i18nPlaceholderKey?: string;
    isError?: boolean;
    isSearch?: boolean;
    errorMessage?: string;
    autocomplete?: "on" | "off";
    on?: BaseProps["on"];
  } = {},
): ComponentNode<InputProps, Input> => {
  const params = getInputProps(
    id,
    fieldId,
    i18nLabelKey,
    i18nPlaceholderKey,
    isError,
    errorMessage,
    autocomplete,
    on,
  );

  return {
    params,
    factory: buildInput,
    runtime: {
      instance: buildInput(params),
    },
  };
};

const getInputProps = (
  id: ComponentId,
  fieldId: FieldType,
  i18nLabelKey: string,
  i18nPlaceholderKey: string = i18nLabelKey,
  isError: boolean = false,
  errorMessage: string = "",
  autocomplete: "on" | "off" = "on",
  on: BaseProps["on"] = {},
): ComponentParams<InputProps> => {
  return {
    configs: {
      id,
      rootTag: "label",
      classNames: css.inputLabelWrap,
      fieldId,
      i18nLabelKey,
      type: getInputTypeByFieldId(fieldId),
      i18nPlaceholderKey,
      for: fieldId,
      isError,
      errorMessage,
      autocomplete,
    },
    on,
  };
};

const buildInput: ComponentFactory<InputProps, Input> = (
  params: ComponentParams<InputProps>,
): Input => {
  const { id, rootTag } = params.configs;

  const deps: ComponentDeps<InputProps> = {
    domService: new DOMService(id, rootTag),
    fragmentService: new FragmentService(),
  };
  const node = {
    params,
    factory: buildInput,
  };

  return new Input({ deps, node });
};
