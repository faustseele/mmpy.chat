import { RouteLink } from "@shared/types/universal.ts";
import { AppState } from "../store/model/Store.ts";
import { RouteContract } from "./types.ts";

export function guardRoute(
  route: RouteContract,
  state: AppState,
): {
  /* 'ok' means that the route can be rendered */
  ok: boolean;
  redirect?: RouteLink.SignIn | RouteLink.NotFound;
} {

  /* user is not logged in and trying to access a protected route,leave the current route */
  if (route.authStatus === "protected" && !isAuthenticated(state)) {
    console.warn("User not logged in", state);
    return {
      ok: false,
      redirect: RouteLink.SignIn,
    };
  }

  /* a guest-only route is accessed by a user, leave the current route */
  if (route.authStatus === "guest" && !isGuest(state)) {
    console.warn("User is logged in", state);
    return {
      ok: false,
      redirect: RouteLink.NotFound,
    };
  }

  /* route is appropriate to the user-status */
  return {
    ok: true,
  };
}

function isAuthenticated(state: AppState): boolean {
  return state.controllers.isLoggedIn;
}

function isGuest(state: AppState): boolean {
  return !state.controllers.isLoggedIn;
}
