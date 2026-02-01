import { handleUpdateAvatar } from "@/entities/user/model/actions.ts";
import { getAvatarNode } from "@/shared/ui/Avatar/factory.ts";
import { AppState } from "@app/providers/store/model/Store.ts";
import { ComponentPatch } from "@shared/lib/Component/model/types.ts";
import { SettingsProps } from "./types.ts";

export const mapSettingsState = ({
  api: {
    auth: { user },
  },
}: AppState): ComponentPatch<SettingsProps> => {
  const user_avatar = getAvatarNode(
    "user_avatar",
    -1,
    "user_avatar",
    user?.avatar,
    {
      hasInput: true,
      size: "xl",
      updateAvatar: (file) => handleUpdateAvatar(file),
    },
  );
  const user_avatar_mobile = getAvatarNode(
    "user_avatar_mobile",
    -1,
    "user_avatar",
    user?.avatar,
    {
      hasInput: true,
      size: "m",
      updateAvatar: (file) => handleUpdateAvatar(file),
    },
  );

  return {
    configs: {
      rootTag: "form",
      profileName: user?.first_name ?? "",
      user,
    },
    children: {
      nodes: {
        user_avatar,
        user_avatar_mobile,
      },
    },
  };
};
