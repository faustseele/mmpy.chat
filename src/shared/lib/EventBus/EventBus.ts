import { GlobalEvent } from "./events.ts";
import { EventCallback } from "./types.ts";

/**
 * generic event bus for sub to, unsub from & emitting events
 * @template E — string for event names
 */
export default class EventBus<E extends string> {
  private _listeners: Partial<Record<E, EventCallback[]>> = {};

  /**
   * subs a cb to an event
   * @param event — event name
   * @param cb — fn to execute when the event is emitted
   * @returns clean-up fn to unsub this specific listener
   */
  public on(event: E, cb: EventCallback): () => void {
    if (!this._listeners[event]) this._listeners[event] = [];

    this._listeners[event].push(cb);

    return () => this.off(event, cb);
  }

  /**
   * unsub a specific cb from an event
   * @param event — event name
   * @param cb — callback fn to remove
   */
  public off(event: E, cb: EventCallback): void {
    const listeners = this._listeners[event];

    if (!listeners || listeners.length === 0) {
      this._logUnmatchedEvent(event, "off");
      return;
    }

    this._listeners[event] = listeners.filter((listener) => listener !== cb);
  }

  /**
   * emits an event, triggering all subbed callbacks
   * @param event — event name to emit
   * @param args - arguments to pass to the callbacks
   */
  public emit(event: E, ...args: unknown[]): void {
    const listeners = this._listeners[event];

    if (!listeners || listeners.length === 0) {
      this._logUnmatchedEvent(event, "emit");
      return;
    }

    listeners.forEach((listener) => {
      /* the void operator 
        marks the async promise as fire-and-forget */
      void listener(...args);
    });
  }

  private _logUnmatchedEvent(event: E, action: "off" | "emit"): Error {
    return new Error(`Not found event called '${event}' in '${action}' action`);
  }
}

export const globalBus = new EventBus<GlobalEvent>();
