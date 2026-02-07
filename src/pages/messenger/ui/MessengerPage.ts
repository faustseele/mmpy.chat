import Store from "@/app/providers/store/model/Store.ts";
import { MessageField } from "@/features/send-message/ui/MessageField.ts";
import { isMobile } from "@/shared/lib/browser/isMobile.ts";
import { cx } from "@/shared/lib/helpers/formatting/classnames.ts";
import { Spinner } from "@/shared/ui/Spinner/Spinner.ts";
import cssPage from "@pages/page/ui/page.module.css";
import { Page } from "@pages/page/ui/Page.ts";
import { ComponentProps } from "@shared/lib/Component/model/types.ts";
import { Button } from "@shared/ui/Button/Button.ts";
import {
  handleAddChat,
  handleAddNotes,
  handleDeleteChat,
} from "../model/actions.ts";
import { MessengerNodes, MessengerProps } from "../model/types.ts";
import css from "./messenger.module.css";

export class MessengerPage extends Page<MessengerProps> {
  constructor(props: ComponentProps<MessengerProps, MessengerPage>) {
    super(props);
  }

  public getRootTagCx(): string {
    const mobile = isMobile();

    return cx(
      cssPage.moduleWindow,
      mobile && cssPage.moduleWindow_mobile,
      css.moduleWindow_messenger,
      mobile && css.moduleWindow_messengerMobile,
    );
  }

  public componentDidMount(): void {
    if (!this.children?.nodes) {
      throw new Error("MessengerPage: Children are not defined");
    }

    console.log(Store.getState());

    /* --- getting instances --- */
    const {
      addNotesButton,
      findUserChatButton,
      deleteChatButton,
      deleteNotesButton,
    } = this.children.nodes as MessengerNodes;
    const addChat = addNotesButton.runtime?.instance as Button;
    const addUser = findUserChatButton.runtime?.instance as Button;
    const deleteNotes = deleteNotesButton.runtime?.instance as Button;
    const deleteChat = deleteChatButton.runtime?.instance as Button;

    /* --- settings events --- */
    this._wireAddNotes(addChat);
    this._wireAddChat(addUser);
    this._wireDeleteChat(deleteChat);
    this._wireDeleteChat(deleteNotes);
  }

  public componentDidUpdate(): void {
    const spinner = this.children?.nodes["spinner"].runtime
      ?.instance as Spinner;
    const msgField = this.children?.nodes["messageField"].runtime
      ?.instance as MessageField;

    const isLoadingMessages = this.configs.isLoadingMessages;

    spinner.setProps({
      configs: {
        isOn: isLoadingMessages,
      },
    });
    msgField.setProps({
      configs: {
        placeholder:
          this.configs.info.type === "notes" ? "Заметка:" : "Cообщение...",
      },
    });
  }

  private _wireAddChat(addUser: Button) {
    if (!this.on.findUser || !this.on.addChatWithUser) {
      console.error("MessengerPage: params.on is bad", this.on);
      return;
    }

    addUser?.setProps({
      on: {
        click: () => handleAddChat(this.on),
      },
    });
  }

  private _wireAddNotes(addNotes: Button) {
    addNotes?.setProps({
      on: {
        click: () => handleAddNotes(this.on),
      },
    });
  }

  private _wireDeleteChat(deleteChat: Button) {
    deleteChat.setProps({
      on: {
        click: (e: Event) => handleDeleteChat(e, this.configs.info, this.on),
      },
    });
  }

  public getInnerMarkup(): string {
    const type = this.configs.info.type;
    const isStub = type === "stub";
    const isNotes = type === "notes";
    const isChat = type === "chat";

    if (!this.children?.nodes)
      return /*html*/ `<span>ERROR: MessengerPage: Children are not defined</span>`;

    const {
      heading_chats,
      heading_goToSettings,
      addNotesButton,
      chatAvatar,
      findUserChatButton,
      closeChatButton,
      deleteNotesButton,
      deleteChatButton,
      messageField,
      spinner,
    } = this.children.nodes as MessengerNodes;

    const mobile = isMobile();
    const activeId = Store.getState().api.chats.activeId;

    const shouldShowAside = () => {
      if (!mobile) return true;

      /* mobile-view conditions */
      if (isStub) return true;

      if (activeId) return false;

      console.error("shouldShowAside has unhandled case", {
        mobile,
        isStub,
        activeId,
      });
      return true;
    };

    const shouldShowMain = () => {
      if (!mobile) return true;

      /* mobile-view conditions */
      if (isStub) return false;

      if (activeId) return true;

      console.error("shouldShowMain has unhandled case", {
        mobile,
        isStub,
        activeId,
      });
      return false;
    };

    const showAside = shouldShowAside();
    const showMain = shouldShowMain();

    return /*html*/ `
      {{#if ${showAside}}}
        <aside class="${css.catalogue} ${mobile ? css.catalogue_mobile : ""}">
        
          <header class="${css.catalogue__head}">
              {{{ ${heading_chats.params.configs.id} }}}
              {{{ ${heading_goToSettings.params.configs.id} }}}
          </header>

          {{#if ${mobile}}}
            <div class="${css.catalogue__headingsMobile}">
            {{{ ${addNotesButton.params.configs.id} }}}
            {{{ ${findUserChatButton.params.configs.id} }}}
            </div>
          {{/if}}

          <ul class="${css.catalogue__items}">
            {{{ goToChatItems }}}
          </ul>
        </aside>
      {{/if}}

      {{#if ${showMain}}}
        <main class="${css.chat} ${mobile ? css.chat_mobile : ""}">
          <header class="${css.chatHeader}">
            <div class="${css.chatHeader__face}">

              {{#if ${isChat || isNotes}}}
                {{{ ${chatAvatar.params.configs.id} }}}
                <p class="${css.chatTitle}">{{ info.chatTitle }}</p>
              {{/if}}

            </div>

            <div class="${css.chatHeader__options}">
              {{#if ${isStub}}}
                {{{ ${addNotesButton.params.configs.id} }}}
                {{{ ${findUserChatButton.params.configs.id} }}}
              {{/if}}

              {{#if ${isChat}}}
                {{{ ${deleteChatButton.params.configs.id}}}}
                {{{ ${closeChatButton.params.configs.id} }}}
              {{/if}}

              {{#if ${isNotes}}}
                {{{ ${deleteNotesButton.params.configs.id}}}}
                {{{ ${closeChatButton.params.configs.id} }}}
              {{/if}}
            </div>
          </header>

          <div class="${css.chat__feed}">
            {{#if ${isChat || isNotes}}}
              {{{ ${spinner.params.configs.id} }}}

              {{#if hasMessages}}
                {{{ messages }}}
              {{else}}

                {{#unless isLoadingMessages}}
                  <p class="${css.noMessages}">${isNotes ? "Нет заметок" : "Нет сообщений"}</p>
                {{/unless}}
                
              {{/if}}
            {{/if}}
          </div>

          {{#if ${isChat || isNotes}}}
            {{{ ${messageField.params.configs.id} }}}
          {{/if}}
        </main>
      {{/if}}
    `;
  }
}
