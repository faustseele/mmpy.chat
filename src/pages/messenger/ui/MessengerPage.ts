import Store from "@app/providers/store/model/Store.ts";
import { MessageField } from "@features/send-message/ui/MessageField.ts";
import cssPage from "@pages/page/ui/page.module.css";
import { Page } from "@pages/page/ui/Page.ts";
import { i18n } from "@shared/i18n/I18nService.ts";
import { isMobile } from "@shared/lib/browser/isMobile.ts";
import { ComponentProps } from "@shared/lib/Component/model/types.ts";
import { cx } from "@shared/lib/helpers/formatting/classnames.ts";
import { Button } from "@shared/ui/Button/Button.ts";
import { Spinner } from "@shared/ui/Spinner/Spinner.ts";
import {
  handleAddChatPrompt,
  handleAddNotesPrompt,
  handleDeleteChatPrompt,
} from "../model/actions.ts";
import { MessengerNodes, MessengerProps } from "../model/types.ts";
import css from "./messenger.module.css";

export class MessengerPage extends Page<MessengerProps> {
  private prevPlaceholder: string = "";
  private prevSpinner: boolean = false;

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

    const isLoadingMessages = this.configs.isLoadingMessages ?? false;
    const placeholder =
      this.configs.info.type === "notes" ? "Заметка:" : "Cообщение...";

    /* caching placeholder & spinner to avoid unnecessary re-renders */
    if (isLoadingMessages !== this.prevSpinner && spinner) {
      spinner.setProps({ configs: { isOn: isLoadingMessages } });
      this.prevSpinner = isLoadingMessages;
    }
    if (placeholder !== this.prevPlaceholder && msgField) {
      msgField.setProps({ configs: { placeholder } });
      this.prevPlaceholder = placeholder;
    }
  }

  private _wireAddChat(addUser: Button) {
    if (!addUser) {
      console.error("MessengerPage: addUser Button", this.children);
      return;
    }

    addUser.setProps({
      on: {
        click: () => handleAddChatPrompt(),
      },
    });
  }

  private _wireAddNotes(addNotes: Button) {
    addNotes?.setProps({
      on: {
        click: handleAddNotesPrompt,
      },
    });
  }

  private _wireDeleteChat(deleteChat: Button) {
    deleteChat.setProps({
      on: {
        click: (e: Event) =>
          handleDeleteChatPrompt(e, this.configs.info),
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
                  <p class="${css.chatPlaceholderText}">${i18n.t(isNotes ? "messenger.message.noNotes" : "messenger.message.noMessages")}</p>
                {{/unless}}
                
              {{/if}}
            {{/if}}
            {{#if ${isStub}}}
              <p class="${css.chatPlaceholderText}">${i18n.t("messenger.message.stub")}</p>
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
