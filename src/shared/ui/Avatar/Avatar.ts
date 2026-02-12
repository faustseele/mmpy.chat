import Component from "@/shared/lib/Component/model/Component.ts";
import { ComponentProps } from "@/shared/lib/Component/model/types.ts";
import { cx } from "@/shared/lib/helpers/formatting/classnames.ts";
import css from "./avatar.module.css";
import { AvatarConfigs, AvatarProps } from "./types.ts";
import { avatarId } from "./utils.ts";

export class Avatar extends Component<AvatarProps> {
  constructor(props: ComponentProps<AvatarProps, Avatar>) {
    super(props);

    if (this.configs.hasInput) {
      const inputId = avatarId(this.configs.chatId);
      
      this.element?.setAttribute("for", inputId);
      this._wireInput();
    }
  }

  public getRootTagCx(configs: AvatarConfigs): string {
    const { size } = configs;
    const modifier = (() => {
      switch (size) {
        case "m":
          return "";
        case "l":
          return css.avatarWrap_l;
        case "xl":
          return css.avatarWrap_xl;
        default:
          return "";
      }
    })();
    return cx(css.avatarWrap, modifier);
  }

  private _wireInput(): void {
    const input = this.element?.querySelector<HTMLInputElement>(
      `#${avatarId(this.configs.chatId)}`,
    );

    if (!input || input.dataset.bound) return;

    input.addEventListener("change", async () => {
      const file = input.files?.[0];

      if (!file || !this.on?.updateAvatar) {
        console.error("No active chat to update avatar or bad file", this, file);
        return;
      }

      await this.on.updateAvatar(file);

      input.value = "";
    });
    input.dataset.bound = "true";
  }

  public componentDidRender(): void {
    /* re-binding avatar change event */
    this._wireInput();
  }

  public getInnerMarkup(): string {
    const inputId = avatarId(this.configs.chatId);

    /* fetchpriority="high" for optimal LCP timing */
    return /*html*/ `
      <img class="${css.avatarWrap__img}" src="{{src}}" alt="Participant's avatar" fetchpriority="high"/>

      {{#if noAvatar }}
        <span class="${css.avatarWrap__letter}"> {{letter}} </span>
      {{/if}}

      {{#if hasInput}}
        <div class="${css.avatarWrap__inputOverlay}">
          <span>🔄</span>
        </div>

        <input id="${inputId}" type="file" name="avatar" class="${css.avatarFileInput}" />
      {{/if}}
    `;
  }
}
