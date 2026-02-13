import { ZERO_WIDTH_SPACE } from "@/shared/config/const.ts";
import { API_URL_RESOURCES } from "@/shared/config/urls.ts";
import { globalBus } from "@/shared/lib/EventBus/EventBus.ts";
import { urlToFile } from "@/shared/lib/helpers/file.ts";
import Router from "@app/providers/router/Router.ts";
import UserService from "@entities/user/model/UserService.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { MessengerConfigs, MessengerOn } from "./types.ts";
import { randomNoteLabel } from "./utils.ts";

export const handleFindUser = async (login: string) => {
  return await UserService.findByLogin(login);
};

export const handleGoToSettings = () => {
  Router.go(RouteLink.Settings);
};

export const handleAddChat = async (on: MessengerOn) => {
  const explanation = `Логин пользователя (например):
  \n• miathompson \n• lucasbrown \n• noahrodriguez \n• emmawilson \n• liamgarcia \n• oliviamartinez \n• sophialee \n• masonkim \n• isabellapatel \n• ethanwong \n• emil \n• LevTolstoy \n• yandex \n• LeUser \n• mishima \n• tolkien \n• baudrillard \n• foucault \n• shakespear`;

  const input = window.prompt(explanation, "");
  if (input === null) return;

  globalBus.emit("toast", { msg: "Adding user..." });

  const login = input.trim();
  if (!login) return;

  const resUser = await on.findUser(login);
  if (!resUser.ok || !resUser.data) {
    console.error("ChatService: addUser failed:", resUser);
    globalBus.emit("toast", {
      msg: `User with '${login}' login is not found`,
      type: "error",
    });
    return;
  }

  const user = resUser.data!;

  const newChatRes = await on.addChatWithUser(
    user.first_name,
    user.second_name,
  );
  if (!newChatRes.ok) {
    console.error("ChatService: addUser failed:", newChatRes);
    globalBus.emit("toast", {
      msg: `Cannot add the user, ${newChatRes.err?.reason}`,
      type: "error",
    });
    return;
  }

  const chatId = newChatRes.data!.id;

  const resAddUser = await on.addUser(chatId, user.id);

  if (resAddUser.ok) {
    globalBus.emit("toast", { msg: "User added successfully." });
  } else {
    console.error("ChatService: addUser failed:", resAddUser);
    globalBus.emit("toast", {
      msg: `Cannot add the user, ${resAddUser.err?.reason}`,
      type: "error",
    });
    return;
  }

  if (user.avatar) {
    const avatar = await urlToFile(`${API_URL_RESOURCES}${user.avatar}`);
    on.updateChatAvatar(chatId, avatar);
  }

  console.log(`User ${user.login} (id=${user.id}) added to chat`, chatId);
};

export const handleAddNotes = async (on: MessengerOn) => {
  const chatName = randomNoteLabel();
  const input = window.prompt("Как назовём заметки?", chatName);
  if (input === null) return;

  const title = input.trim() + ZERO_WIDTH_SPACE;
  if (!title) return;

  on?.addNotes?.(title);
};

export const handleDeleteChat = async (
  e: Event,
  info: MessengerConfigs["info"],
  on: MessengerOn,
) => {
  e.preventDefault();

  if (info.type === "stub") {
    console.error("MessengerPage: info is stub");
    return;
  }

  const { chatId, chatTitle } = info;

  const confirm = window.confirm(
    `Вы уверены, что хотите удалить '${chatTitle}'?`,
  );
  if (!confirm) return;

  if (chatId) on?.deleteChat?.(chatId, chatTitle);
};
