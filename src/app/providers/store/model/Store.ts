import { PageNode } from "@pages/page/model/types.ts";
import { Page } from "@pages/page/ui/Page.ts";
import { BaseProps } from "@shared/lib/Component/model/base.types.ts";
import { ComponentId } from "@shared/lib/Component/model/types.ts";
import EventBus from "@shared/lib/EventBus/EventBus.ts";
import { initialState } from "../config/init.ts";
import { set } from "../lib/utils.ts";
import { APIState, StoreEventBusEvents } from "./types.ts";

export interface AppState {
  api: APIState;
  controllers: {
    isLoggedIn: boolean;
  };
  pageNodes: Record<ComponentId, PageNode<BaseProps, Page<BaseProps>>>;
}

class Store extends EventBus<StoreEventBusEvents> {
  private static __instance: Store;
  private state: AppState = { ...initialState };
  
  private constructor() {
    super();
  }

  public static getInstance() {
    if (!this.__instance) {
      this.__instance = new Store();
    }
    return this.__instance;
  }

  public getState() {
    return this.state;
  }

  public set(path: string, value: unknown) {
    set(this.state, path, value);
    /* passing the new state to the subscribers */
    this.emit("updated", this.getState());
  }

  public reset() {
    this.state = { ...initialState }; 
  }
}

export default Store.getInstance();
