import { PageNode } from "@pages/page/model/types.ts";
import { Page } from "@pages/page/ui/Page.ts";
import { BaseProps } from "@shared/lib/Component/model/base.types.ts";
import { ComponentPatch } from "@shared/lib/Component/model/types.ts";
import { getProjection } from "../lib/patch.ts";
import { merge } from "../lib/utils.ts";
import Store from "./Store.ts";
import { MapStateToProps } from "./types.ts";
import { isEqual } from "@shared/lib/helpers/object/utils.ts";

/* bridges Store <-> Page blueprint */
export function connect<P extends BaseProps, C extends Page<P>>(
  blueprint: PageNode<P, C>,
  mapStateToProps: MapStateToProps<P>,
): C {
  const id = blueprint.params.configs.id;
  const nodeInStore = Store.getState().pageNodes[id];

  /* working-node from now-on */
  let connectedNode = nodeInStore;

  if (!nodeInStore) {
    /* on initial Page connection */
    blueprint.runtime = { instance: blueprint.factory(blueprint.params) };

    /* registers new page-node */
    Store.set("pageNodes", {
      ...Store.getState().pageNodes,
      [id]: blueprint,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connectedNode = blueprint as any;
  } else if ((nodeInStore as { __disposed?: boolean }).__disposed) {
    /* recreates instance after prior unmount */
    nodeInStore.runtime = { instance: nodeInStore.factory(nodeInStore.params) };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (nodeInStore as any).__disposed = false;
    connectedNode = nodeInStore;
  }

  function patchChildren(patch: ComponentPatch<P>) {
    const patched = patch.children?.nodes;
    const existing = connectedNode.params.children?.nodes;

    if (patched) {
      Object.keys(patched).forEach((nodeId) => {
        const exists = existing?.[nodeId]?.runtime?.instance;
        if (!exists) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const factory = patched[nodeId]?.factory as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params = patched[nodeId]?.params as any;
            patched[nodeId]!.runtime = {
              instance: factory(params),
            };
          } catch (err) {
            console.error("connect: failed to instantiate child", nodeId, err);
          }
        }
      });
    }
  }

  function handlePatch() {
    const state = Store.getState();
    const patch = mapStateToProps(state);

    /* projection -> only patch-realted props from connectedNode.params */
    const projection = getProjection(connectedNode.params, patch);

    if (!isEqual(projection, patch)) {
      patchChildren(patch);

      const patchedParams = merge(connectedNode.params, patch);
      connectedNode.runtime?.instance.setProps(patchedParams);
    }
  }

  /* initial patch on connect */
  handlePatch();

  /* on Store changes */
  const onStoreUpdated = () => {
    handlePatch();
  };
  Store.on("updated", onStoreUpdated);

  connectedNode.runtime?.instance.bus.on("flow:component-did-unmount", () => {
    /* cleans up subscription on page unmount */
    Store.off("updated", onStoreUpdated);

    /* marks __disposed so next connect() recreates instance lazily */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (connectedNode as any).__disposed = true;
  });

  if (!connectedNode.runtime) {
    console.error('', connectedNode, blueprint);
    throw new Error("connect: connectedNode.runtime is undefined");
  }

  return connectedNode.runtime!.instance as C;
}
