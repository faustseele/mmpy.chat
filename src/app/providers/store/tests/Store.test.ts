import { describe, it, expect, beforeEach, vi } from "vitest";
import Store from "../model/Store.ts";

describe("App/Providers: Store", () => {
  beforeEach(() => {
    /* resetting singleton for east test */
    Store.reset();
  });

  it("should UPDATE State via a nested path", () => {
    Store.set("api.auth.user.first_name", "Puppet");

    const state = Store.getState();
    
    /* checks values */
    expect(state.api.auth.user?.first_name).toBe("Puppet");

    /* checks if other parts of the state weren't destroyed */
    expect(state.api.chats.list).toBeNull(); 
  });

  it('should EMIT an \'updated\' event when state changes', () => {
    const mockHandler = vi.fn();
    
    Store.on("updated", mockHandler);

    Store.set("some.key", true);
    expect(mockHandler).toHaveBeenCalled();
  });
});
