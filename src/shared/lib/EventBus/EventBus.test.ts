import { describe, expect, it, vi } from "vitest";
import EventBus from "./EventBus.ts";

describe("Shared/Lib: EventBus", () => {
  it("should execute a callback when on event-EMIT", () => {
    const bus = new EventBus();
    const mockHandler = vi.fn();

    bus.on("test-event", mockHandler);
    bus.emit("test-event", "payload-data");

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith("payload-data");
  });

  it("should NOT throw an error when on event-EMIT if event is not registered", () => {
    const bus = new EventBus();
    const mockHandler = vi.fn();

    bus.on("test-event", mockHandler);

    expect(() => bus.emit("not-registered-event")).not.toThrow();
  });

  it("should NOT execute a callback after event-OFF", () => {
    const bus = new EventBus();
    const mockHandler = vi.fn();

    bus.on("ghost-event", mockHandler);
    bus.off("ghost-event", mockHandler);
    bus.emit("ghost-event");

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should execute multiple callbacks for the same event-EMIT", () => {
    const bus = new EventBus();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    bus.on("multi-event", handler1);
    bus.on("multi-event", handler2);
    bus.emit("multi-event");

    /* toHaveBeenCalledTimes here for regression safety */
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it("should reach the event-EMIT if multiple args are passed", () => {
    const bus = new EventBus();
    const handler = vi.fn();

    bus.on("multi-args-event", handler);
    bus.emit("multi-args-event", "arg1", "arg2");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("should NOT crash EventBus on throwing an error", () => {
    const bus = new EventBus();

    /* 'number' instead of 'string' for fault tolerance testing */
    const errorEvent = -1;

    /* @ts-expect-error -> Used for testing */
    bus.on(errorEvent, () => {});

    /* @ts-expect-error -> Used for testing */
    expect(() => bus.emit(errorEvent)).not.toThrow();
  });
});
