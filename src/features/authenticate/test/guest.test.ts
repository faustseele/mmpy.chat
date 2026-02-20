import Router from "@/app/providers/router/Router.ts";
import { handleFetchChats } from "@/entities/chat/model/actions.ts";
import { globalBus } from "@/shared/lib/EventBus/EventBus.ts";
import { RouteLink } from "@/shared/types/universal.ts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleGuestSignIn } from "../model/actions-guest.ts";
import AuthService from "../model/AuthService.ts";

/* vi.hoisted() here bc vi.mocks() are auto-hoisted to the top by vitest */
const goodGuest = vi.hoisted(() => ({
  ok: true,
  data: {
    id: 1,
    email: "whisper@mmpy.messenger.com",
    login: "whisper",
    first_name: "Whisper",
    second_name: "Guest",
    display_name: "whisper",
    phone: "+79897675454",
  },
}));
const badGuest = vi.hoisted(() => ({
  ok: false,
  err: {
    status: 500,
    reason: "Test Error",
    response: "Test Response",
  },
}));

/* mock AuthService to evade hitting server thru XMLHttpRequest -> keeping I/O out of test */
vi.mock("../model/AuthService.ts", () => {
  return {
    /* 'default' is here bc AuthService has 'export default' */
    default: {
      signIn: vi.fn().mockResolvedValue(goodGuest),
    },
  };
});

/* mock Router to evade hitting `window` -> keeping I/O out of test */
vi.mock("../../../app/providers/router/Router.ts", () => {
  return {
    default: {
      go: vi.fn(),
    },
  };
});

/* mock handleFetchChats */
vi.mock("../../../entities/chat/model/actions.ts", () => {
  return {
    handleFetchChats: vi.fn(),
  };
});

/* spying on globalBus.emit for Toast */
const spiedToast = vi.spyOn(globalBus, "emit");

describe("@Features/Auth: Guest", () => {
  /* just to make expect-fns in it-blocks fresh-start friendly */
  beforeEach(() => {
    vi.clearAllMocks();

    /* silencing console.error */
    vi.spyOn(console, "error").mockImplementation(() => {})
  });

  it("should navigate to Messenger-Page and fetch chats on success", async () => {
    const result = await handleGuestSignIn();

    /* checking if handleFetchChats was called */
    expect(handleFetchChats).toHaveBeenCalledExactlyOnceWith();

    /* checking if Router.go() was called with the right route */
    expect(Router.go).toHaveBeenCalledExactlyOnceWith(RouteLink.Messenger);

    /* checking if Toast has been fired
    toHaveBeenCalledWith instead of toHaveBeenCalledExactlyOnceWith
    bc we call 2 toasts in Guest-Flow */
    expect(spiedToast).toHaveBeenCalledWith("toast", {
      msg: "👻 Guest Login Success!",
      type: "success",
    });

    expect(result).toEqual(goodGuest);
  });

  it("should handle failed login", async () => {
    /* overriding AuthService.signIn to return error */
    vi.mocked(AuthService.signIn).mockResolvedValueOnce(badGuest);

    const result = await handleGuestSignIn();

    /* checking for idle Router. no calls to Router.go() should happen */
    expect(Router.go).not.toHaveBeenCalled();

    /* checking for idle handleFetchChats */
    expect(handleFetchChats).not.toHaveBeenCalled();

    /* checking for the last-fired Toast */
    expect(spiedToast).toHaveBeenLastCalledWith("toast", {
      msg: badGuest.err?.reason,
      type: "error",
    });

    /* asserting result */
    expect(result).toEqual(badGuest);
  });
});
