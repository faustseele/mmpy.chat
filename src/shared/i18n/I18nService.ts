import Store from "@app/providers/store/model/Store.ts";
import { ls_getLocale, ls_setLocale } from "../lib/LocalStorage/actions.ts";
import { Dictionary, Locale, resolveKey } from "./dictionary.ts";

/**
 * this service manages application localization,
 * dictionaries and language state
 */
class I18nService {
  private _lang: Locale = ls_getLocale();
  private _dict: Dictionary = {};

  /**
   * inits the i18n service by resolving
   * the initial language and loading the _dict
   */
  public async init(): Promise<void> {
    /* using dynamic imports 4 bundle splitting */
    const module = await import(`./locales/${this._lang}.json`);
    /* vite follows ES Modules for dynamic imports -> `module.default` */
    this._dict = module.default;
  }

  /**
   * translates a given key path using the active _dict
   * @param {string} path - dot-separated translation key
   * @returns {string} resolved string or the path if not found
   */
  public t(path: string): string {
    if (!Object.keys(this._dict).length) {
      console.error("i18n.t: dictionary not loaded");
      return path;
    };
    return resolveKey(this._dict, path);
  }

  /**
   * returns the active language
   * @returns {Locale} active language
   */
  public getLanguage(): Locale {
    return this._lang;
  }

  /**
   * updates apps lang, syncs storage, and triggers store reactivity
   * @param {Locale} lang - lang to switch to
   */
  public async setLanguage(lang: Locale): Promise<void> {
    if (this._lang === lang) return;

    ls_setLocale(lang);
    this._lang = lang;

    /* load new dictionary */
    await this.init();

    /* only after set store state */
    Store.set("controllers.language", lang);
  }
}

export const i18n = new I18nService();
