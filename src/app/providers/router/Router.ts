import Store from "@app/providers/store/model/Store.ts";
import { Page } from "@pages/page/ui/Page.ts";
import { BaseProps } from "@shared/lib/Component/model/base.types.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { guardRoute } from "./guards.ts";
import Route from "./Route.ts";
import { RouteConfigs, RouteContract } from "./types.ts";
import { extractParams, matchPath } from "./utils.ts";

/**
 * @class Router is a @mediator singleton class that listens
 *  to URL changes and calls the appropriate Route.
 *  E.g: '/sign-up -> new Route -> new AuthPage(SignUp)'
 * mimics History API.
 * handles the API access for the Pages.
 * @Singleton ensures there is only one central routing.
 * @Builder allowes chaining 'use()' calls.
 */

class Router {
  /** The single instance of the Router. */
  private static __instance: Router;

  /**
   * History API object.
   * Used for handling address bar without page reload.
   * Used to add entries to the browser's history stack for navigation.
   */
  private _history: History = window.history;

  /**
   * list of all registered routes in the application
   * Route is used due to contravariance
   */
  private _routes: RouteContract[] = [];

  private _currentRoute: RouteContract | null = null;

  /** base path prefix for subdirectory deployments (e.g. '/mmpy.chat') */
  private _basePath = "";

  constructor() {
    if (Router.__instance) return Router.__instance;
    Router.__instance = this;
  }

  /** returns the app-relative pathname, stripped of the base path prefix */
  private get _pathname(): string {
    return window.location.pathname.slice(this._basePath.length) || "/";
  }

  /**
   * registers a new Route with the Router.
   * @returns this for chaining
   */
  public use<P extends BaseProps, C extends Page<P>>(
    routeConfigs: RouteConfigs,
    pageFactory: () => C,
  ): this {
    const route = new Route({ routeConfigs, pageFactory });
    this._routes.push(route);
    return this;
  }

  /* inits Router; sets root query to existing Routes */
  public async start(basePath = "/"): Promise<void> {
    this._basePath = basePath.replace(/\/$/, "");

    /* adds listener that's triggered
      when the active history entry changes. */
    window.onpopstate = () => {
      this._onRouteChange(this._pathname);
    };

    /* initial page load */
    this._onRouteChange(this._pathname);
  }

  /** triggered when the URL changes */
  private _onRouteChange(path: RouteLink | string): void {
    const route = this._routes.find((route) => matchPath(path, route.path));

    if (!route) {
      console.warn("Route not found", path);
      this.go(RouteLink.NotFound);
      return;
    }

    const guardRes = guardRoute(route, Store.getState());

    if (!guardRes.ok) {
      this.go(guardRes.redirect!);
      return;
    }

    const params = extractParams(path, route.path);
    route.setRouteConfigs({ params });

    this._currentRoute?.leave();
    this._currentRoute = route;
    this._currentRoute!.render();
  }

  public go(path: RouteLink): void {
    this._history.pushState({}, "", this._basePath + path);
    this._onRouteChange(path);
  }

  public back(): void {
    this._history.back();
  }

  public forward(): void {
    this._history.forward();
  }
}

export default new Router();
