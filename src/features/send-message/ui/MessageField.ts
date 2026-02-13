import Component from "@shared/lib/Component/model/Component.ts";
import { ComponentProps } from "@shared/lib/Component/model/types.ts";
import { handleAttachImage } from "../model/actions.ts";
import { MessageFieldProps } from "../model/types.ts";
import css from "./messageField.module.css";

export class MessageField extends Component<MessageFieldProps> {
  constructor(props: ComponentProps<MessageFieldProps, MessageField>) {
    super(props);
  }

  public componentDidRender(): void {
    this._wireAttach();
  }

  private _wireAttach(): void {
    const attach = this.element?.querySelector<HTMLInputElement>(
      `#${css.attachInput}`,
    );

    if (!attach || attach.dataset.bound) return;

    attach.addEventListener("change", async (e) => {
      await handleAttachImage(e);
      attach.value = "";
    });
    attach.dataset.bound = "true";
  }

  public getInnerMarkup(): string {
    return /*html*/ `
      <label for="${css.attachInput}" class="${css.inputButton} ${css.inputButton_attach}" aria-label="Attach Image"></label>
      <input id="${css.attachInput}" type="file" name="image"/>
      <input
        class="${css.input}"
        name="{{id}}"
        type="{{type}}"
        id="{{id}}"
        placeholder="{{placeholder}}"
        aria-label="{{label}}"
        autocomplete="off"
      />
      <button type="submit" class="${css.inputButton} ${css.inputButton_send}" aria-label="Send message"></button>
    `;
  }
}
