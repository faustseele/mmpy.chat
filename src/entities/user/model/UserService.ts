import { UpdateUserPassword, UserResponse } from "@shared/api/model/api.types";
import { ApiError, ApiResponse } from "@shared/api/model/types.ts";
import Store from "@app/providers/store/model/Store.ts";
import UserAPI from "@entities/user/api/UserAPI.ts";

class UserService {
  public async updateProfile(
    data: Partial<UserResponse>,
  ): Promise<ApiResponse<UserResponse>> {
    try {
      const updatedUser = await UserAPI.updateProfile(data);

      Store.set("api.auth.user", updatedUser);
      return { ok: true, data: updatedUser };
    } catch (e) {
      console.error(`profile update fail, data=${data}`, e);
      return { ok: false, err: e as ApiError };
    }
  }

  public async updatePassword(
    data: UpdateUserPassword,
  ): Promise<ApiResponse<string>> {
    try {
      const updatedUser = await UserAPI.updatePassword(data);

      /* updatedUser is null by default */
      return { ok: true, data: updatedUser };
    } catch (e) {
      console.error(`psw update fail, data=${data}`, e);
      return { ok: false, err: e as ApiError };
    }
  }

  public async updateAvatar(data: File): Promise<ApiResponse<UserResponse>> {
    try {
      const updatedUser = await UserAPI.updateAvatar(data);

      Store.set("api.auth.user", updatedUser);
      return { ok: true, data: updatedUser };
    } catch (e) {
      console.error(`avatar update fail, file=${data}`, e);
      return { ok: false, err: e as ApiError };
    }
  }

  public async findByLogin(login: string): Promise<ApiResponse<UserResponse>> {
    try {
      const users = await UserAPI.findUsers({ login });
      const res = users?.[0] ?? null;
      return { ok: true, data: res };
    } catch (e) {
      console.error(`findByLogin fail, login=${login}`, e);
      return { ok: false, err: e as ApiError };
    }
  }
}

export default new UserService();
