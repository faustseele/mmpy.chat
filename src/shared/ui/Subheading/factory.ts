import {
  ComponentDeps,
  ComponentId,
  ComponentNode,
  ComponentParams,
} from "../../lib/Component/model/types.ts";
import DOMService from "../../lib/DOM/DOMService.ts";
import FragmentService from "../../lib/Fragment/FragmentService.ts";
import { ComponentFactory } from "../../lib/helpers/factory/types.ts";
import cssSubheading from "./subheading.module.css";
import { Subheading } from "./Subheading.ts";
import { SubheadingProps } from "./types.ts";

export const getSubheadingNode = (
  id: string,
  i18nKey: string,
  {
    isDrama,
  }: { isDrama?: boolean } = {},
): ComponentNode<SubheadingProps, Subheading> => {
  const params = getSubheadingProps(id, i18nKey, isDrama);
  return {
    params,
    factory: buildSubheading,
    runtime: {
      instance: buildSubheading(params),
    },
  };
};

const getSubheadingProps = (
  id: ComponentId,
  i18nKey: string,
  isDrama: boolean = false,
): ComponentParams<SubheadingProps> => {
  return {
    configs: {
      id,
      rootTag: "h2",
      classNames: cssSubheading.subheading,
      i18nKey,
      isDrama,
    },
  };
};

const buildSubheading: ComponentFactory<SubheadingProps, Subheading> = (
  params: ComponentParams<SubheadingProps>,
): Subheading => {
  const { id, rootTag } = params.configs;

  const deps: ComponentDeps<SubheadingProps> = {
    domService: new DOMService(id, rootTag),
    fragmentService: new FragmentService(),
  };

  const node = {
    params,
    factory: buildSubheading,
  };

  return new Subheading({ deps, node });
};
