import { i18n } from "@shared/i18n/I18nService.ts";
import { cx } from "@shared/lib/helpers/formatting/classnames.ts";
import Component from "../../lib/Component/model/Component.ts";
import { ComponentProps } from "../../lib/Component/model/types.ts";
import css from "./subheading.module.css";
import { SubheadingProps } from "./types.ts";

export class Subheading extends Component<SubheadingProps> {
  constructor(props: ComponentProps<SubheadingProps, Subheading>) {
    super(props);
  }

  public getRootTagCx(): string {
    const { isDrama } = this.configs;
    return cx(
      css.subheading,
      isDrama && css.subheading_drama,
    );
  }

  public getInnerMarkup(): string {
    return /*html*/ `
      ${i18n.t(this.configs.i18nKey)} 
    `;
  }
}
