import { cx } from "@/shared/lib/helpers/formatting/classnames.ts";
import Component from "@shared/lib/Component/model/Component.ts";
import { ComponentProps } from "@shared/lib/Component/model/types.ts";
import {
  GoToChatConfigs,
  GoToChatNodes,
  GoToChatProps,
} from "../model/types.ts";
import css from "./goToChat.module.css";

export class GoToChat extends Component<GoToChatProps> {
  constructor(props: ComponentProps<GoToChatProps, GoToChat>) {
    super(props);
  }

  public getRootTagCx(configs: GoToChatConfigs): string {
    const { type, selected } = configs;
    const isNotes = type === "notes";
    return cx(
      css.goToChat,
      isNotes && css.goToChat_note,
      selected && css.goToChat_selected,
    );
  }

  public getInnerMarkup(): string {
    if (!this.children?.nodes)
      return `<span>ERROR: GoToChat: Children are not defined</span>`;
    const { chatAvatar } = this.children.nodes as GoToChatNodes;

    return /*html*/ `
      {{{ ${chatAvatar.params.configs.id} }}}

      <div class="${css.goToChat__content}">
        <p class="${css.userName}">{{ userName }}</p>
        {{#if contentText }}
          <p class="${css.contentText}">{{ contentText }}</p>
        {{/if}}
      </div>

      <div class="${css.goToChat__infoBox}">
        <p class="${css.infoBoxText}">{{ date }}</p>
        {{#if unread_count }}
          <p class="${css.infoBoxText} ${css.infoBoxText_unread}">{{ unreadCount }}</p>
        {{/if}}
      </div>
    `;
  }
}
