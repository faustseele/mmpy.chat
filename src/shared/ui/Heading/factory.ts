import {
  ComponentDeps,
  ComponentId,
  ComponentNode,
  ComponentParams,
} from "../../lib/Component/model/types.ts";
import DOMService from "../../lib/DOM/DOMService.ts";
import FragmentService from "../../lib/Fragment/FragmentService.ts";
import { ComponentFactory } from "../../lib/helpers/factory/types.ts";
import css from "./heading.module.css";
import { Heading } from "./Heading.ts";
import { HeadingOn, HeadingProps } from "./types.ts";

export const getHeadingNode = (
  id: string,
  i18nKey: string,
  {
    isClickable,
    isDrama,
    on,
  }: {
    isClickable?: boolean;
    isDrama?: boolean;
    on?: HeadingOn;
  } = {},
): ComponentNode<HeadingProps, Heading> => {
  const params = getHeadingProps(id, i18nKey, isClickable, isDrama, on);

  return {
    params,
    factory: buildHeading,
    runtime: {
      instance: buildHeading(params),
    },
  };
};

const getHeadingProps = (
  id: ComponentId,
  i18nKey: string,
  isClickable: boolean = false,
  isDrama: boolean = false,
  on: HeadingOn = {},
): ComponentParams<HeadingProps> => {
  return {
    configs: {
      id,
      rootTag: "h1",
      classNames: css.heading,
      i18nKey,
      isClickable,
      isDrama,
    },
    on: { ...on },
  };
};

const buildHeading: ComponentFactory<HeadingProps, Heading> = (
  params: ComponentParams<HeadingProps>,
): Heading => {
  const { id, rootTag } = params.configs;

  const deps: ComponentDeps<HeadingProps> = {
    domService: new DOMService(id, rootTag),
    fragmentService: new FragmentService(),
  };
  const node = {
    params,
    factory: buildHeading,
  };

  return new Heading({ deps, node });
};
