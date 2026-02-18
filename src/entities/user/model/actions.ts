import { UserResponse } from "@shared/api/model/api.types.ts";
import { ApiResponse } from "@shared/api/model/types.ts";
import { UpdatePasswordData, UpdateProfileData } from "./types.ts";
import UserService from "./UserService.ts";

export const handleUpdateProfile = async (
  data: UpdateProfileData,
): Promise<Promise<ApiResponse<Partial<UserResponse>>>> => {
  return await UserService.updateProfile(data);
};

export const handleUpdatePassword = async (
  data: UpdatePasswordData,
): Promise<ApiResponse<string>> => {
  return await UserService.updatePassword(data);
};

export const handleUpdateAvatar = async (avatar: File): Promise<ApiResponse<UserResponse>> => {
  return await UserService.updateAvatar(avatar);
};
