import { isMobile } from "@/shared/lib/browser/isMobile.ts";
import { cx } from "@/shared/lib/helpers/formatting/classnames.ts";
import cssPage from "@pages/page/ui/page.module.css";
import { Page } from "@pages/page/ui/Page.ts";
import { ComponentProps } from "@shared/lib/Component/model/types.ts";
import { getInstances } from "@shared/lib/helpers/factory/functions.ts";
import FormValidator from "@shared/lib/validation/FormValidator.ts";
import { Button } from "@shared/ui/Button/Button.ts";
import { Input } from "@shared/ui/Input/Input.ts";
import { InputProps } from "@shared/ui/Input/types.ts";
import { handleGuestClick } from "../model/actions.ts";
import { AuthNodes, AuthProps } from "../model/types.ts";
import { onBadForm, onGoodForm } from "../model/utils.ts";
import css from "./auth.module.css";

export class AuthPage extends Page<AuthProps> {
  private footerModifier: string = "";
  private validator: FormValidator | null = null;
  private submit: Button | null = null;

  constructor(props: ComponentProps<AuthProps, AuthPage>) {
    super(props);

    this.footerModifier =
      props.node.params.configs.type === "sign-up" ? css.authFooter_signUp : "";
  }

  public getRootTagCx(): string {
    const mobile = isMobile();

    return cx(
      cssPage.moduleWindow,
      mobile && cssPage.moduleWindow_mobile,
      css.moduleWindow_auth,
    );
  }

  public componentDidMount(): void {
    if (!this.children?.edges) {
      throw new Error("children is not defined");
    }

    /* --- getting instances --- */
    const { buttonFormSubmit, buttonGuest } = this.children.nodes as AuthNodes;
    const inputs = getInstances<InputProps, Input>(this.children, "inputs");
    this.submit = buttonFormSubmit.runtime?.instance as Button;
    const guest = buttonGuest.runtime?.instance as Button;
    this.validator = new FormValidator(inputs);

    /* --- setting events --- */
    this._wireSubmit(this.validator, this.submit);
    this._vivifyInputs(inputs, this.validator);
    this._wireGuestClick(guest);
  }

  private _wireGuestClick(guest: Button): void {
    guest.setProps({
      on: {
        click: () => handleGuestClick(guest),
      },
    });
  }

  private _wireSubmit(validator: FormValidator, submit: Button): void {
    submit.setProps({
      on: {
        click: async (event: Event) => {
          event.preventDefault();
          const type = this.configs.type;

          /* guard clause */
          if (!validator) {
            console.error("AuthPage: Validator is not defined");
            return;
          }
          const formValid = validator.onFormCheck(type, onBadForm);
          if (!formValid) return;

          submit.setProps({
            configs: {
              showSpinner: true,
            },
          });

          await validator.onFormSubmit(type, onGoodForm(type));

          submit.setProps({
            configs: {
              showSpinner: false,
            },
          });
        },
      },
    });

    this.setProps({ on: { submit } });
  }

  /* blur-events for the input fields */
  private _vivifyInputs(inputs: Input[], validator: FormValidator): void {
    if (!validator) {
      console.error("AuthPage: Validator is not defined");
      return;
    }

    inputs.forEach((input) => {
      input.setProps({
        on: {
          focusout: () => validator.onInputBlur(input),
        },
      });
    });
  }

  public getInnerMarkup(): string {
    if (!this.children?.nodes)
      return /*html*/ `<span>ERROR: AuthPage: Children are not defined</span>`;

    const { heading, buttonFormSubmit, buttonGuest, buttonReroute } = this
      .children.nodes as AuthNodes;

    return /*html*/ `
      <header class="${css.authHeading}">
        {{{ ${heading.params.configs.id} }}}
      </header>

      <main class="${css.inputsWrapper}">
        {{{ inputs }}}
      </main>

      <footer class="${css.authFooter} ${this.footerModifier}">
        {{{ ${buttonReroute.params.configs.id} }}}
        <div class="${css.authFooter__submits}">
          {{{ ${buttonGuest.params.configs.id} }}}
          {{{ ${buttonFormSubmit.params.configs.id} }}}
        </div>
      </footer> 
      `;
  }
}
