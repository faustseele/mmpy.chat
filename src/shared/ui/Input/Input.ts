import { i18n } from "@shared/i18n/I18nService.ts";
import Component from "../../lib/Component/model/Component.ts";
import { ComponentProps } from "../../lib/Component/model/types.ts";
import { setTextSafe } from "../../lib/security/sanitize.ts";
import css from "./input.module.css";
import { FieldType, InputProps } from "./types.ts";

export class Input extends Component<InputProps> {
  private input: HTMLInputElement | undefined = undefined;
  private errorLabel: HTMLElement | undefined = undefined;

  constructor({ deps, node }: ComponentProps<InputProps, Input>) {
    super({ deps, node });

    this.element?.setAttribute("for", this.configs.for);
  }

  private _getElements(): void {
    this.input = this.element?.querySelector("input") ?? undefined;
    this.errorLabel =
      this.element?.querySelector(`.${css.errorLabel}`) ?? undefined;
  }

  public componentDidMount(): void {
    this._getElements();
  }

  public componentDidRender(): void {
    this._getElements();
  }

  public getNameAndValue(): { name: FieldType | ""; value: string } {
    if (!this.input) {
      console.error("input is not defined", this.input);
      return { name: "", value: "" };
    }

    return { name: this.input.name as FieldType, value: this.input.value };
  }

  public cleanInput(): void {
    if (!this.input) {
      console.error("input is not defined", this.input);
      return;
    }

    this.input.value = "";
  }

  public showError(message: string): void {
    if (!this.input || !this.errorLabel) {
      console.error(
        "input or error-labal is not defined",
        this.input,
        this.errorLabel,
      );
      return;
    }

    setTextSafe(this.errorLabel, message);
    this.errorLabel.style.display = "block";
    this.input.classList.add("class", css.input_error);
  }

  public hideError(): void {
    if (!this.input || !this.errorLabel) {
      console.error(
        "input or error-labal is not defined",
        this.input,
        this.errorLabel,
      );
      return;
    }

    this.errorLabel.style.display = "none";
    this.input.classList.remove("class", css.input_error);
  }

  public getInnerMarkup(): string {
    return /*html*/ `
      <input
        class="${css.input} {{#if isSearch}}${css.input_search} {{/if}}"
        name="{{fieldId}}"
        type="{{type}}"
        id="{{fieldId}}"
        placeholder="${i18n.t(this.configs.i18nPlaceholderKey)}"
        autocomplete="on"
      />
      <span class="${css.errorLabel}"></span>
    `;
  }
}
