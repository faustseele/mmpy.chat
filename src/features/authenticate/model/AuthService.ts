import UserAPI from "@entities/user/api/UserAPI.ts";
import {
  SignInRequest,
  SignUpRequest,
  UserResponse,
} from "@shared/api/model/api.types.ts";
import { ApiError, ApiResponse } from "@shared/api/model/types.ts";
import Store from "@app/providers/store/model/Store.ts";
import {
  ls_removeLastChatId,
  ls_setLoggedIn,
} from "@shared/lib/LocalStorage/actions.ts";
import AuthAPI from "../api/AuthAPI.ts";

class AuthService {
  public async signUp(data: SignUpRequest): Promise<ApiResponse<UserResponse>> {
    try {
      await AuthAPI.signUp(data);
      let user = await AuthAPI.requestUser();

      if (!user) {
        Store.set("controllers.isLoggedIn", false);
        Store.set("api.auth.user", null);
        return {
          ok: false,
          err: {
            status: 400,
            reason: "Bad request",
            response: "Wasn't able to sign up. Please try again.",
          },
        };
      }

      Store.set("controllers.isLoggedIn", true);
      ls_setLoggedIn(true);

      /* ya-praktikum.tech API strips down surname to 1st char ('Petrov' to 'P'),
        -> updateProfile() & store correct one */
      user = ((second_name) => {
        user = {
          ...user,
          second_name,
        };

        /* no-await; bc its's a hook */
        UserAPI.updateProfile(user);
        return user;
      })(data.second_name);

      Store.set("api.auth.user", user);
      return { ok: true, data: user };
    } catch (e) {
      ls_setLoggedIn(false);

      console.error("signUp failed", e);
      return { ok: false, err: e as ApiError };
    }
  }

  public async signIn(data: SignInRequest): Promise<ApiResponse<UserResponse>> {
    try {
      await AuthAPI.signIn(data);
      const user = await AuthAPI.requestUser();

      Store.set("api.auth.user", user);
      if (user) {
        Store.set("controllers.isLoggedIn", true);
        ls_setLoggedIn(true);
      } else {
        Store.set("controllers.isLoggedIn", false);
        ls_setLoggedIn(false);
      }

      return { ok: !!user, data: user };
    } catch (e: unknown) {
      const err = e as ApiError;

      ls_setLoggedIn(false);

      console.error("signIn failed", err);
      return { ok: false, err };
    }
  }

  public async fetchUser(): Promise<ApiResponse<UserResponse>> {
    try {
      const user = await AuthAPI.requestUser();
      if (user) {
        Store.set("api.auth.user", user);
        Store.set("controllers.isLoggedIn", true);
        ls_setLoggedIn(true);
        return { ok: true, data: user };
      } else {
        Store.set("api.auth.user", null);
        Store.set("controllers.isLoggedIn", false);
        ls_setLoggedIn(false);

        return {
          ok: false,
          err: {
            status: 401,
            reason: "Unauthorized",
            response: "Non-API resp: User is not logged in",
          },
        };
      }
    } catch (e) {
      ls_removeLastChatId();

      return { ok: false, err: e as ApiError };
    }
  }

  public async logout(): Promise<ApiResponse<boolean>> {
    try {
      const res = await AuthAPI.logout();
      Store.set("api.chats.activeId", null);
      Store.set("api.chats.currentChat", null);
      Store.set("api.chats.list", null);

      Store.set("controllers.isLoggedIn", false);
      ls_setLoggedIn(false);

      /* remove last active chat */
      ls_removeLastChatId();

      return { ok: !!res, data: res };
    } catch (e) {
      console.error("logout failed", e);

      ls_setLoggedIn(false);
      return { ok: false, err: e as ApiError };
    }
  }
}

export default new AuthService();
