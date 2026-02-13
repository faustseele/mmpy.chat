import { isMobile } from "@/shared/lib/browser/isMobile.ts";
import { cx } from "@/shared/lib/helpers/formatting/classnames.ts";
import { handleUpdateAvatar } from "@entities/user/model/actions.ts";
import { handleLogout } from "@features/authenticate/model/actions.ts";
import { InputEditor } from "@features/edit-profile/ui/InputEditor.ts";
import cssPage from "@pages/page/ui/page.module.css";
import { Page } from "@pages/page/ui/Page.ts";
import { ComponentProps } from "@shared/lib/Component/model/types.ts";
import { getInstances } from "@shared/lib/helpers/factory/functions.ts";
import FormValidator from "@shared/lib/validation/FormValidator.ts";
import { Button } from "@shared/ui/Button/Button.ts";
import { Heading } from "@shared/ui/Heading/Heading.ts";
import { InputProps } from "@shared/ui/Input/types.ts";
import { handleSwitchType, handleValidateAndSubmit } from "../model/actions.ts";
import { SettingsNodes, SettingsProps } from "../model/types.ts";
import css from "./settings.module.css";

export class SettingsPage extends Page<SettingsProps> {
  protected get isInfo(): boolean {
    return this.configs.type === "change-info";
  }

  constructor(props: ComponentProps<SettingsProps, SettingsPage>) {
    super(props);
  }

  public getRootTagCx(): string {
    const mobile = isMobile();

    return cx(
      cssPage.moduleWindow,
      css.moduleWindow_settings,
      mobile && cssPage.moduleWindow_mobile,
      mobile && css.moduleWindow_settingsMobile,
    );
  }

  public componentDidMount(): void {
    if (!this.children || !this.children.nodes) {
      console.error("SettingsPage: Children are not defined", this);
      return;
    }

    /* --- getting instances --- */
    const {
      heading_backToChats,
      buttonEditInfo,
      buttonEditPassword,
      buttonLogout,
    } = this.children.nodes as SettingsNodes;
    const heading = heading_backToChats.runtime?.instance as Heading;
    const editInfo = buttonEditInfo.runtime?.instance as Button;
    const editPassword = buttonEditPassword.runtime?.instance as Button;
    const logoutBtn = buttonLogout.runtime?.instance as Button;
    const inputs_info = getInstances<InputProps, InputEditor>(
      this.children!,
      "inputsEditors_info",
    );
    const inputs_psw = getInstances<InputProps, InputEditor>(
      this.children!,
      "inputsEditors_password",
    );

    /* --- vivifying inputs --- */
    const validator_info = new FormValidator(inputs_info);
    this._vivifyInputs(inputs_info, validator_info);
    const validator_psw = new FormValidator(inputs_psw);
    this._vivifyInputs(inputs_psw, validator_psw);

    /* sets placeholders for inputs from user-res */
    this._hydrateInputPlaceholders();

    /* --- setting events --- */
    heading.setProps({
      on: { click: this.on?.messengerClick },
    });
    this._wireButtonEvents(
      editInfo,
      editPassword,
      logoutBtn,
      validator_info,
      validator_psw,
    );
  }

  public componentDidRender(): void {
    /* re-binding avatar change e */
    this._wireAvatar();
    /* sets placeholders for inputs from user-res */
    this._hydrateInputPlaceholders();
  }

  private _hydrateInputPlaceholders(): void {
    if (!this.configs.user || !this.children) return;

    const user = this.configs.user;

    const inputs = getInstances<InputProps, InputEditor>(
      this.children,
      "inputsEditors_info",
    );

    inputs.forEach((input) => {
      const field = input.configs.fieldId;

      let placeholder: string | null = null;
      switch (field) {
        case "email":
          placeholder = user.email;
          break;
        case "name":
          placeholder = user.first_name;
          break;
        case "surname":
          placeholder = user.second_name;
          break;
        case "login":
          placeholder = user.login;
          break;
        case "display_name":
          placeholder = user.display_name ?? user.login;
          break;
        case "phone":
          placeholder = user.phone;
          break;
        default:
          placeholder = null;
      }

      if (placeholder !== null) {
        input.setProps({ configs: { placeholder } });
      }
    });
  }

  private _wireButtonEvents(
    editInfo: Button,
    editPassword: Button,
    logoutBtn: Button,
    validator_info: FormValidator,
    validator_psw: FormValidator,
  ) {
    editInfo.setProps({
      on: {
        click: async (e: Event) => {
          e.preventDefault();

          if (this.configs.type === "change-info") {
            handleValidateAndSubmit("change-info", validator_info, editInfo);
          } else {
            handleSwitchType("change-info", editInfo, editPassword, this);
          }
        },
      },
    });
    editPassword.setProps({
      on: {
        click: async (e: Event) => {
          e.preventDefault();

          if (this.configs.type === "change-password") {
            handleValidateAndSubmit(
              "change-password",
              validator_psw,
              editPassword,
            );
          } else {
            handleSwitchType("change-password", editPassword, editInfo, this);
          }
        },
      },
    });
    logoutBtn.setProps({
      on: {
        click: async (e: Event) => {
          e.preventDefault();
          logoutBtn.setProps({
            configs: {
              showSpinner: true,
            },
          });
          
          await handleLogout();

          logoutBtn.setProps({
            configs: {
              showSpinner: false,
            },
          });
        },
      },
    });

    /* def type is 'edit-info'; switched in _switchType() */
    this.setProps({ on: { submit: editInfo.on?.click } });
  }

  private _wireAvatar(): void {
    const input =
      this.element?.querySelector<HTMLInputElement>("#avatar-input");
    if (!input || input.dataset.bound) return;

    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;

      await handleUpdateAvatar(file);
      input.value = "";
    });
    input.dataset.bound = "true";
  }

  private _vivifyInputs(inputs: InputEditor[], validator: FormValidator) {
    inputs.forEach((input) => {
      input!.setProps({
        on: { focusout: () => validator.onInputBlur(input) },
      });
    });
  }

  public getInnerMarkup(): string {
    if (!this.children?.nodes)
      return /*html*/ `<span>ERROR: SettingsPage: Children are not defined</span>`;

    const nodes = this.children.nodes as SettingsNodes;

    const {
      heading_profile,
      heading_backToChats,
      user_avatar,
      user_avatar_mobile,
      subheading_form,
      buttonEditInfo,
      buttonEditPassword,
    } = nodes;

    const mobile = isMobile();

    return /*html*/ `
      <header class="${css.settingsHeadings} ${mobile && css.settingsHeadings_mobile}">
        {{#if ${mobile}}}
          <div class="${css.settingsHeadings__mobile}">
            {{{${user_avatar_mobile.params.configs.id} }}}
            <h2 class="${css.settingsFace__name}">{{ profileName }}</h2>
          </div>
        {{else}}
          {{{ ${heading_profile.params.configs.id} }}}
        {{/if}}

        {{{ ${heading_backToChats.params.configs.id} }}}
      </header>
      
      <main class="${css.settingsContent}">
        {{#unless ${mobile}}}
          <div class="${css.settingsFace}">
            {{{${user_avatar.params.configs.id} }}}

            <h2 class="${css.settingsFace__name}">{{ profileName }}</h2>
          </div>
        {{/unless}}

        <div class="${css.settingsInputs}">
          {{{ ${subheading_form.params.configs.id} }}}

          <div class="${css.settingsInputs__list}">
            {{#if ${this.isInfo}}}
              {{{ inputsEditors_info }}}
            {{else}}
              {{{ inputsEditors_password }}}  
            {{/if}}
          </div>
        </div>
      </main>

      <footer class="${css.footer}">
        <div class="${css.footer__horBtns}">
          {{{ ${buttonEditInfo.params.configs.id} }}}
          {{{ ${buttonEditPassword.params.configs.id} }}}
        </div>
        {{{ ${nodes["buttonLogout"].params.configs.id} }}}
      </footer>
    `;
  }
}
