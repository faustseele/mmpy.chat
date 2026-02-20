import { vi } from "vitest";

function localStorageMock() {
  let ls: Record<string, string> = {};
  return {
    /* wrapping in vi.fn(), so we can verify the behavior 
      of the functions (getItem(), setItem(), etc.) */
    /* e.g: expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true') */
    getItem: vi.fn((key: string) => ls[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      ls[key] = value.toString();
    }),
    clear: vi.fn(() => {
      ls = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete ls[key];
    }),
  };
}

function xhrMock(): Partial<XMLHttpRequest> {
  return {
    open: vi.fn(),
    send: vi.fn(),
    setRequestHeader: vi.fn(),
    readyState: 4,
    status: 200,
    response: { success: true },
    /* these need to be accessible so the test can trigger them */
    onload: vi.fn(),
    onerror: vi.fn(),
    onabort: vi.fn(),
    ontimeout: vi.fn(),
  };
}

/* stubs the global object */
/* mocks a singleton instance of 'localStorage' */
vi.stubGlobal("localStorage", localStorageMock());
/* vi.fn() is used to track 'new XMLHttpRequest()' and mock it w/ xhrMock() */
vi.stubGlobal("XMLHttpRequest", vi.fn(xhrMock));
