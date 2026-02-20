/**
 * Shared API types based on Swagger.
 * Clean, reusable, and exported for use across features/entities.
 */

import { ChatType } from "@entities/chat/model/types.ts";

// Common aliases
export type UserId = number;
export type ChatId = number;
export type MessageId = number;
export type ISODateString = string;

// Generic API error
export interface APIError {
  reason: string;
}

// A common OK response used by several endpoints
export type OkResponse = string; // typically "OK"

// ========================
// Auth
// ========================

/* POST /auth/signUp */
export interface SignUpRequest {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

/* POST /auth/signUp */
export interface SignUpResponse {
  id: number;
}

/* POST /auth/signIn */
export interface SignInRequest {
  login: string;
  password: string;
}

/* POST /auth/logout */
export type LogoutResponse = OkResponse;

/* GET /auth/user */
export interface UserResponse {
  id: UserId;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

// ========================
// OAuth (Yandex)
// ========================

/* GET /oauth/yandex/service-id */
export interface OAuthServiceIdResponse {
  service_id: string;
}

/* POST /oauth/yandex */
export interface OAuthSignInRequest {
  code: string;
  redirect_uri: string;
}

// ========================
// Users
// ========================

/* PUT /user/profile */
export type UpdateUserProfile = Partial<Omit<UserResponse, "id" | "avatar">>;
export type UpdateUserProfileResponse = UserResponse;

/* PUT /user/password */
export interface UpdateUserPassword {
  oldPassword: string;
  newPassword: string;
}
export type UpdateUserPasswordResponse = OkResponse;

/* PUT /user/profile/avatar */
export interface UpdateUserAvatar {
  avatar: File;
}
export type UpdateUserAvatarResponse = UserResponse;

/* POST /user/search */
export interface FindUserRequest {
  login: string;
}
export type FindUserResponse = UserResponse[];

// ========================
// Chats
// ========================

/* GET /chats (query) */
export interface GetChatsQuery {
  offset?: number;
  limit?: number;
  title?: string;
}

/* POST /chats */
export interface CreateChatRequest {
  title: string;
}
export interface CreateChatResponse {
  id: ChatId;
}

/* DELETE /chats */
export interface DeleteChatRequest {
  chatId: ChatId;
}
export type DeleteChatResponse = OkResponse;

/** User info in a chat's last_message */
export interface ChatLastMessageUser {
  first_name: string;
  second_name: string;
  avatar: string;
  email: string;
  login: string;
  phone: string;
}

/** A chat object from GET /chats list */
export interface ChatResponse {
  id: ChatId;
  /* non-API type for 2 types of chats: chat w/ person & personal notes */
  type?: ChatType;
  title: string;
  avatar: string | null;
  unread_count: number;
  created_by: UserId;
  last_message: {
    user: ChatLastMessageUser;
    time: ISODateString;
    content: string;
  } | null;
}

/* PUT /chats/users and DELETE /chats/users */
export interface ChatUsersRequest {
  users: UserId[];
  chatId: ChatId;
}
export type ChatUsersResponse = OkResponse;

/* GET /chats/:id/users (query) */
export interface ChatUsersQuery {
  offset?: number;
  limit?: number;
  name?: string;
  email?: string;
}

/* GET /chats/:id/users */
export interface ChatUser {
  id: UserId;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string | null;
  role: "admin" | "regular";
}

/* POST /chats/token/:id */
export interface ChatTokenResponse {
  token: string;
}

/* PUT /chats/avatar */
export interface UpdateChatAvatarRequest {
  chatId: ChatId;
  avatar: File;
}
export type UpdateChatAvatarResponse = OkResponse;

// ========================
// WebSocket (Messages)
// ========================

export interface ChatMessageFile {
  id: number;
  user_id: UserId;
  path: string;
  filename: string;
  content_type: string;
  content_size: number;
  upload_date: ISODateString;
}

export interface ChatMessage {
  id: MessageId;
  chat_id: ChatId;
  user_id: UserId;
  time: ISODateString;
  type: "message";
  content: string;
  is_read: boolean;
  file?: ChatMessageFile | null;
}

// outgoing client events
export type WSOutgoingMessage =
  | { type: "message"; content: string }
  | { type: "get old"; content: string }
  | { type: "ping" };

// incoming server events
export type WSIncomingUserConnected = { type: "user connected"; content: string };
export type WSIncomingPong = { type: "pong" };
export type WSIncomingError = { type: "error"; content: string };

export type WSIncomingMessage = ChatMessage | WSIncomingUserConnected | WSIncomingPong | WSIncomingError;

export type WSHistoryResponse = ChatMessage[];
