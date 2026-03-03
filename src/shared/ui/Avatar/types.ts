import { ChatId, UserResponse } from "@shared/api/model/api.types.ts";
import {
  BaseConfigs,
  BaseProps,
} from "../../lib/Component/model/base.types.ts";
import { RootTag } from "../../lib/DOM/types.ts";
import { ApiResponse } from "@shared/api/model/types.ts";

export interface AvatarProps extends BaseProps {
  configs: AvatarConfigs;
  on: {
    updateAvatar?: UpdateAvatarCb;
  };
}

export interface AvatarConfigs extends BaseConfigs {
  rootTag: Extract<RootTag, "label" | "div">;
  i18nAltKey: string;
  title: string;
  chatId: ChatId;
  src: string;
  letter: string;
  noAvatar: boolean;
  hasInput?: boolean;
  size: AvatarSize;
}

export type AvatarSize = "m" | "l" | "xl";

export type UpdateAvatarCb =
  | ((file: File) => Promise<void>)
  | ((file: File) => Promise<ApiResponse<UserResponse>>);
