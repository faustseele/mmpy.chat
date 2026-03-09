import Router from "@app/providers/router/Router.ts";
import {
  handleAddUser,
  handleCreateChat,
  handleDeleteChat,
  handleUpdateChatAvatar,
} from "@entities/chat/model/actions.ts";
import UserService from "@entities/user/model/UserService.ts";
import { ZERO_WIDTH_SPACE } from "@shared/config/const.ts";
import { API_URL_RESOURCES } from "@shared/config/urls.ts";
import { i18n } from "@shared/i18n/I18nService.ts";
import { globalBus } from "@shared/lib/EventBus/EventBus.ts";
import { GlobalEvent } from "@shared/lib/EventBus/events.ts";
import { downloadFile } from "@shared/lib/helpers/file.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { MessengerConfigs } from "./types.ts";
import { randomNoteLabel } from "./utils.ts";

export const handleFindUser = async (login: string) => {
  return await UserService.findByLogin(login);
};

export const handleGoToSettings = () => {
  Router.go(RouteLink.Settings);
};

export const handleAddChatPrompt = async () => {
  const explanation = `${i18n.t("messenger.actions.findUserPrompt")}
  \n• miathompson \n• lucasbrown \n• noahrodriguez \n• emmawilson \n• liamgarcia \n• oliviamartinez \n• sophialee \n• masonkim \n• isabellapatel \n• ethanwong \n• emil \n• LevTolstoy \n• yandex \n• LeUser \n• mishima \n• tolkien \n• baudrillard \n• foucault \n• shakespear`;

  const input = window.prompt(explanation, "");
  if (input === null) return;

  globalBus.emit(GlobalEvent.Toast, {
    msg: i18n.t("toasts.chats.addUserLoading"),
  });

  const login = input.trim();
  if (!login) return;

  const resUser = await handleFindUser(login);
  if (!resUser.ok || !resUser.data) {
    console.error("ChatService: addUser failed:", resUser);
    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n.t("toasts.chats.addUserNotFoundStub").replace("${}", login),
      type: "error",
    });
    return;
  }

  const user = resUser.data!;

  const newChatRes = await handleCreateChat(
    `${user.first_name} ${user.second_name}`,
    true,
  );

  if (!newChatRes.ok) {
    console.error("ChatService: addUser failed:", newChatRes);
    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n.t("toasts.chats.addUserErrorStub").replace("${}", user.login),
      type: "error",
    });
    return;
  }

  const chatId = newChatRes.data!.id;

  const resAddUser = await handleAddUser(chatId, user.id);

  if (resAddUser.ok) {
    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n.t("toasts.chats.addUserSuccessStub").replace("${}", user.login),
    });

    const avatarUrl = user.avatar;
    if (avatarUrl) {
      const avatar = await downloadFile(`${API_URL_RESOURCES}${avatarUrl}`);
      handleUpdateChatAvatar(chatId, avatar);
    }
  } else {
    console.error("ChatService: addUser failed:", resAddUser);
    globalBus.emit(GlobalEvent.Toast, {
      msg: i18n.t("toasts.chats.addUserErrorStub").replace("${}", user.login),
      type: "error",
    });
    return;
  }

};

export const handleAddNotesPrompt = async () => {
  const chatName = randomNoteLabel();
  const input = window.prompt(
    i18n.t("messenger.actions.newNotesPrompt"),
    chatName,
  );
  if (input === null) return;

  const title = input.trim() + ZERO_WIDTH_SPACE;
  if (!title) return;

  handleCreateChat(title);
};

export const handleDeleteChatPrompt = async (
  e: Event,
  info: MessengerConfigs["info"],
) => {
  e.preventDefault();

  if (info.type === "stub") {
    console.error("MessengerPage: info is stub");
    return;
  }

  const { chatId, chatTitle } = info;

  const confirm = window.confirm(
    `${i18n.t("messenger.actions.deletionEnsuring")} '${chatTitle}'?`,
  );
  if (!confirm) return;

  if (chatId) handleDeleteChat(chatId, chatTitle);
};
