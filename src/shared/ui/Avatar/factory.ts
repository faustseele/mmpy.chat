import { ChatId } from "@shared/api/model/api.types.ts";
import { API_URL_RESOURCES } from "@shared/config/urls.ts";
import {
  ComponentDeps,
  ComponentId,
  ComponentNode,
  ComponentParams,
} from "@shared/lib/Component/model/types.ts";
import DOMService from "@shared/lib/DOM/DOMService.ts";
import FragmentService from "@shared/lib/Fragment/FragmentService.ts";
import { ComponentFactory } from "@shared/lib/helpers/factory/types.ts";
import css from "./avatar.module.css";
import { Avatar } from "./Avatar.ts";
import { AvatarProps, AvatarSize, UpdateAvatarCb } from "./types.ts";
import defaultAvatar from "/avatar.png";

export const getAvatarNode = (
  id: ComponentId,
  chatId: ChatId,
  title: string | undefined = undefined,
  src: string | null | undefined = undefined,
  {
    hasInput = false,
    size = "m",
    updateAvatar = undefined,
  }: {
    hasInput?: boolean;
    size?: AvatarSize;
    updateAvatar?: UpdateAvatarCb;
  } = {},
): ComponentNode<AvatarProps> => {
  const params: ComponentParams<AvatarProps> = {
    configs: {
      id,
      chatId,
      rootTag: hasInput ? "label" : "div",
      i18nAltKey: "avatar.alt",
      classNames: css.avatarWrap,
      title: title ?? "",
      src: src ? `${API_URL_RESOURCES}/${src}` : defaultAvatar,
      noAvatar: !src,
      letter: (title ?? "?").charAt(0),
      size,
      hasInput,
    },
    on: {
      updateAvatar,
    },
  };

  return {
    params,
    factory: buildAvatar,
    runtime: {
      instance: buildAvatar(params),
    },
  };
};

const buildAvatar: ComponentFactory<AvatarProps, Avatar> = (
  params: ComponentParams<AvatarProps>,
): Avatar => {
  const { id, rootTag } = params.configs;

  const deps: ComponentDeps<AvatarProps> = {
    domService: new DOMService(id, rootTag),
    fragmentService: new FragmentService(),
  };

  const node = {
    params,
    factory: buildAvatar,
  };

  return new Avatar({ deps, node });
};
