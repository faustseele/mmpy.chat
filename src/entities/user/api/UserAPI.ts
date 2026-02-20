import HTTPTransport from "@shared/api/http/HTTPTransport.ts";
import { BaseAPI } from "@shared/api/model/BaseAPI.ts";
import {
  FindUserRequest,
  FindUserResponse,
  UpdateUserPassword,
  UserResponse,
} from "@shared/api/model/api.types";

const userAPIInstance = new HTTPTransport("/user");

class UserAPI extends BaseAPI {
  public updateProfile(data: Partial<UserResponse>): Promise<UserResponse> {
    return userAPIInstance.put("/profile", { data }) as Promise<UserResponse>;
  }

  public updatePassword(data: UpdateUserPassword): Promise<string> {
    return userAPIInstance.put("/password", { data }) as Promise<string>;
  }

  public updateAvatar(data: File): Promise<UserResponse> {
    const form = new FormData();
    form.append("avatar", data);
    return userAPIInstance.put("/profile/avatar", {
      data: form,
    }) as Promise<UserResponse>;
  }

  public findUsers(data: FindUserRequest): Promise<FindUserResponse> {
    return userAPIInstance.post("/search", {
      data,
    }) as Promise<FindUserResponse>;
  }
}

export default new UserAPI();
