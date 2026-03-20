import Router from "@app/providers/router/Router.ts";
import { handleLogout } from "@features/authenticate/model/actions.ts";
import { i18n } from "@shared/i18n/I18nService.ts";
import { RouteLink } from "@shared/types/universal.ts";
import Component from "../../lib/Component/model/Component.ts";
import { ComponentProps } from "../../lib/Component/model/types.ts";
import { NavigationProps } from "./types.ts";
import css from "./navigation.module.css";

/* nav-bar on the left for quick page-travel */
export class Navigation extends Component<NavigationProps> {
  constructor(props: ComponentProps<NavigationProps, Navigation>) {
    super(props);
  }

  public componentDidRender(): void {
    const navs = this.element?.getElementsByClassName("navLink");
    const langSwitch = this.element?.getElementsByClassName("langSwitch")[0];

    if (!navs || !langSwitch) return;

    langSwitch.addEventListener("click", () => {
      i18n.cycleLanguages()
    });

    for (const a of Array.from(navs) as HTMLAnchorElement[]) {
      a.addEventListener("click", async (e: MouseEvent) => {
        e.preventDefault();

        const path = a.getAttribute("href");
        if (path === "/logout") {
          handleLogout();
        } else {
          Router.go(path as RouteLink);
        }
      });
    }
  }

  public getInnerMarkup(): string {
    return /* html */ `
      <a href="/" class="${css.navLink}">Вход 🡽</a>
      <a href="/sign-up" class="${css.navLink}">Регистрация 🡽</a>
      <a href="/messenger" class="${css.navLink}">Чат 🡽</a>
      <a href="/settings" class="${css.navLink}">Профиль 🡽</a>
      <a href="/404" class="${css.navLink}">404 🡽</a>
      <a href="/500" class="${css.navLink}">500 🡽</a>
      <a href="/logout" class="${css.navLink}">[ выход ]</a>
      <button class="langSwitch" style="background: none; color: white; width: 60px;">lang-switch</button>
    `;
  }
}
