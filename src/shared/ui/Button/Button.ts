import { i18n } from "@shared/i18n/I18nService.ts";
import Component from "@shared/lib/Component/model/Component.ts";
import { ComponentProps } from "@shared/lib/Component/model/types.ts";
import css from "./button.module.css";
import { ButtonNodes, ButtonProps } from "./types.ts";
import { cx } from "@shared/lib/helpers/formatting/classnames.ts";

export class Button extends Component<ButtonProps> {
  constructor(props: ComponentProps<ButtonProps, Button>) {
    super(props);
  }

  public getRootTagCx(): string {
    const { isSilent } = this.configs;
    return cx(css.button, isSilent && css.button_silent);
  }

  public componentDidRender(): void {
    if (!this.element) {
      console.error("Button element is null");
      return;
    }

    this.element.setAttribute("type", this.configs.type);
  }

  public getInnerMarkup(): string {
    const nodes = this.children?.nodes as ButtonNodes;

    return /*html*/ `
    {{#if showSpinner}}
      {{{ ${nodes.spinner.params.configs.id} }}}
    {{else}}
      ${i18n.t(this.configs.i18nKey)}
    {{/if}}
    `;
  }
}
