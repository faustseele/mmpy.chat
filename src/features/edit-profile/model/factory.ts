import { getInputTypeByFieldId } from "@/shared/ui/Input/utils.ts";
import { BaseProps } from "@shared/lib/Component/model/base.types.ts";
import {
  ComponentDeps,
  ComponentId,
  ComponentNode,
  ComponentParams,
} from "@shared/lib/Component/model/types.ts";
import DOMService from "@shared/lib/DOM/DOMService.ts";
import FragmentService from "@shared/lib/Fragment/FragmentService.ts";
import { ComponentFactory } from "@shared/lib/helpers/factory/types.ts";
import css from "@shared/ui/Input/input.module.css";
import { FieldType, InputProps } from "@shared/ui/Input/types.ts";
import { InputEditor } from "../ui/InputEditor.ts";

export const getEditorNode = (
  id: ComponentId,
  fieldId: FieldType,
  label: string,
  {
    isError,
    errorMessage,
    autocomplete,
    on,
  }: {
    placeholder?: string;
    isError?: boolean;
    errorMessage?: string;
    autocomplete?: "on" | "off";
    on?: BaseProps["on"];
  } = {},
): ComponentNode<InputProps, InputEditor> => {
  const params = getEditorProps(
    id,
    fieldId,
    label,
    isError,
    errorMessage,
    autocomplete,
    on,
  );
  return {
    params,
    factory: buildInputEditor,
    runtime: {
      instance: buildInputEditor(params),
    },
  };
};

const getEditorProps = (
  id: ComponentId,
  fieldId: FieldType,
  label: string,
  isError: boolean = false,
  errorMessage: string = "",
  autocomplete: "on" | "off" = "off",
  on: BaseProps["on"] = {},
): ComponentParams<InputProps> => {
  return {
    configs: {
      id,
      rootTag: "label",
      classNames: css.inputLabelWrap,
      for: fieldId,
      fieldId,
      label,
      type: getInputTypeByFieldId(fieldId),
      placeholder: '...',
      isError,
      errorMessage,
      autocomplete,
    },
    on,
  };
};

const buildInputEditor: ComponentFactory<InputProps, InputEditor> = (
  params: ComponentParams<InputProps>,
): InputEditor => {
  const { id, rootTag } = params.configs;

  const deps: ComponentDeps<InputProps> = {
    domService: new DOMService(id, rootTag),
    fragmentService: new FragmentService(),
  };

  const node = {
    params,
    factory: buildInputEditor,
  };

  return new InputEditor({ deps, node });
};
