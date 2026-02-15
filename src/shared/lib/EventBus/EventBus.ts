import { EventCallback } from "./types.ts";

/**
 * <TEvents extends string> is used to make the Events generics
 * E.g. ComponentEvents for Component, StoreEvents for Store
 */
export default class EventBus<TEvents extends string> {
  // eslint-disable-next-line no-unused-vars
  private _listeners: { [EventName in TEvents]?: EventCallback[] } = {};

  /* Subscribe to the event */
  public on(event: TEvents, callback: EventCallback): void {
    if (!this._listeners[event]?.length) this._listeners[event] = [];

    this._listeners[event].push(callback);
  }

  /* Unsubscribe from the event */
  public off(event: TEvents, callback: EventCallback): void {
    if (!this._listeners[event]?.length) this._throwNotFoundError(event, "off");

    this._listeners[event] = this._listeners[event]?.filter(
      (listener) => listener !== callback,
    );
  }

  /** Emit event
    @param ...args: gathering multiple params for callback
  */
  public emit(event: TEvents, ...args: unknown[]): void {
    if (!this._listeners[event]?.length) this._throwNotFoundError(event, "emit");

    this._listeners[event]?.forEach((listener) => listener(...args));
  }

  private _throwNotFoundError(event: TEvents, action: "off" | "emit"): Error {
    return new Error(`Not found event called '${event}' in '${action}' action`);
  }
}

export const globalBus = new EventBus();
