import { isMobile } from "@/shared/lib/browser/isMobile.ts";
import { getNavigationNode } from "@/shared/ui/Navigation/factory.ts";
import { getToastNode } from "@/shared/ui/Toast/factory.ts";
import { handleFetchChats } from "@entities/chat/model/actions.ts";
import { handleFetchUser } from "@features/authenticate/model/actions.ts";
import Store from "../providers/store/model/Store.ts";

/* initilizes application; keeps Router separate */
export const initApp = async () => {
  await bootstrapAuth();

  const root = document.getElementsByTagName("body")[0];

  handleUA(root);
  prependGlobalToast(root);
};

const bootstrapAuth = async () => {
  try {
    const user = await handleFetchUser();

    /* no-'await' bc it's unnecessary for FCP to happen */
    if (user.ok) handleFetchChats();

    const isLoggedIn = Store.getState().controllers.isLoggedIn;
    console.log("bootstrapAuth: isLoggedIn?", isLoggedIn);
  } catch (error) {
    throw new Error("bootstrapAuth failed", { cause: error });
  }
};

const handleUA = (root: HTMLBodyElement) => {
  const ua = navigator.userAgent;
  console.log("handleUA: ua", ua);

  if (!isMobile()) prependNavigation(root);
};

const prependGlobalToast = (root: HTMLBodyElement) => {
  const toast = getToastNode("Waiting for the bus..");

  if (!root || !toast.runtime?.instance.element)
    throw new Error("root element not found");

  /* prepending global toast */
  root.prepend(toast.runtime.instance.element);
};

/** for the nav-<a> links */
const prependNavigation = (root: HTMLBodyElement) => {
  const nav = getNavigationNode("navigation");

  if (!nav.runtime?.instance.element) {
    console.error("bootstrapNavigation: nav not found");
    return;
  }

  root.prepend(nav.runtime.instance.element);
};
