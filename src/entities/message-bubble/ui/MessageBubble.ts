import { cx } from "@/shared/lib/helpers/formatting/classnames.ts";
import Component from "@shared/lib/Component/model/Component.ts";
import { ComponentProps } from "@shared/lib/Component/model/types.ts";
import { MessageProps } from "../model/types.ts";
import css from "./messageBubble.module.css";

export class MessageBubble extends Component<MessageProps> {
  constructor(props: ComponentProps<MessageProps, MessageBubble>) {
    super(props);
  }

  public getRootTagCx(): string {
    const { type } = this.configs;
    const msg_modifier = (() => {
      switch (type) {
        case "outgoing":
          return css.message_outgoing;
        case "incoming":
          return css.message_incoming;
        case "date":
          return css.message_dateBubble;
        default:
          return "";
      }
    })();

    return cx(css.message, msg_modifier);
  }

  public getInnerMarkup(): string {
    const isDate = this.configs.type === "date";
    return /*html*/ `
      {{#if ${isDate}}}
        <p class="${css.dateBubble}">{{date}}</p>
      {{else}}
        <div class="${css.content}">
          {{#if image}}
            <img class="${css.content__image}" src="{{image}}" alt="MessageBubble image" />
          {{/if}}
          {{#unless image}}
            {{#if text}}
              <p class="${css.content__text}">{{text}}</p>
            {{/if}}
          {{/unless}}
          <p class="${css.content__infoBox}">{{date}}</p>
        </div>
      {{/if}}
    `;
  }
}
