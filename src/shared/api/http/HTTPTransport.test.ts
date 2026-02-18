import { beforeEach, describe, expect, it, vi } from "vitest";
import HTTPTransport from "./HTTPTransport.ts";

describe("Shared/Api: HTTPTransport", () => {

  beforeEach(() => {
    /* resets the XHR-mock */
    vi.mocked(XMLHttpRequest).mockClear();
  });

  it("should correctly stringify GET parameters and open the XHR-request", async () => {
    const mockUser = { id: 123, first_name: "Puppet" };

    const transport = new HTTPTransport("/auth");

    /* initialize the XHR-request */
    const userPromise = transport.get("/user", {
      data: { id: mockUser.id },
    });

    /* ts-helper: xhr = 'xhrMock' instead of browser's 'XMLHttpRequest' */
    const xhr = vi.mocked(XMLHttpRequest);

    /* collection of all the mocked instances */
    const xhrMocks = xhr.mock;
    const firstXhrMock = xhrMocks.results[0];

    /* gets the mock instance that was just created by 'new XMLHttpRequest' */
    const mockedXhrInstance = firstXhrMock.value;

    /* testing the configuration of the XHR-request */
    expect(mockedXhrInstance.open).toHaveBeenCalledWith(
      "GET",
      expect.stringContaining(`/auth/user?id=${mockUser.id}`),
    );

    /* testing async part */
    /* setting the response */
    mockedXhrInstance.status = 200;
    mockedXhrInstance.response = mockUser;

    /* simulates browser response-event */
    mockedXhrInstance.onload();

    const result = await userPromise;

    /* testing the response thru assertion */
    expect(result).toEqual(mockUser);
  });

  it("should REJECT with a Network Error on failure", async () => {
    const transport = new HTTPTransport("/auth");

    /* initialize the XHR-request */
    const userPromise = transport.get("/user", {});

    /* grabs mock instance (results[0]). mocks are cleared thx to 'beforeEach()' */
    const mockedXhrInstance = vi.mocked(XMLHttpRequest).mock.results[0].value;

    /* simulates network error */
    mockedXhrInstance.onerror();

    /* testing the response thru assertion */
    await expect(userPromise).rejects.toEqual({
      status: 0,
      reason: "Network error",
      response: null,
    });
  });
});
