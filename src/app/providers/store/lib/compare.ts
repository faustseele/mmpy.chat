/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEqual } from "@shared/lib/helpers/object/utils.ts";
import { BaseProps } from "@shared/lib/Component/model/base.types.ts";
import { ComponentId, ComponentNode } from "@shared/lib/Component/model/types.ts";

export function ensureInstance<P extends BaseProps>(node: ComponentNode<P>) {
  if (!node.runtime?.instance) {
    const inst = node.factory(node.params);
    node.runtime = { instance: inst };
  }
}

export function deepEqualExceptChildren(a: any, b: any): boolean {
  if (a === b) return true;
  const { children: _ac, ...aa } = a ?? {};
  const { children: _bc, ...bb } = b ?? {};
  return isEqual(aa, bb);
}

export function edgesLenEqual(
  a: Record<string, ComponentId | ComponentId[]>,
  b: Record<string, ComponentId | ComponentId[]>
): boolean {
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) {
    if (!(k in b)) return false;
    if (linkLen(a[k]) !== linkLen(b[k])) return false;
  }
  return true;
}

export function linkLen(v: ComponentId | ComponentId[] | undefined): number {
  if (v == null) return 0;
  return Array.isArray(v) ? v.length : 1;
}

export function toIds(v: ComponentId | ComponentId[]) {
  return Array.isArray(v) ? v : [v];
}

export function reconcileChildrenByLength<P extends BaseProps>(
  node: ComponentNode<P>,
  prev: Record<string, ComponentId | ComponentId[]>,
  next: Record<string, ComponentId | ComponentId[]>
) {

  /* NB: after apply, node.params === nextParams */
  const prevChildren = node.params.children;              // 
  const nodes = prevChildren?.nodes ?? node.params.children?.nodes ?? {};

  /* slots removed -> unmount everything in that slot */
  for (const slot in prev) {
    if (!(slot in next)) {
      for (const id of toIds(prev[slot]!)) unmount(nodes[id]);
    }
  }

  /* slots added or length changed -> brute remount whole slot */
  for (const slot in next) {
    const sameLen = slot in prev && linkLen(prev[slot]) === linkLen(next[slot]);
    if (!sameLen) {
      if (slot in prev) for (const id of toIds(prev[slot]!)) unmount(nodes[id]);
      for (const id of toIds(next[slot]!)) mount(nodes[id]);
    }
  }
}

export function mount(child: ComponentNode<any>) {
  if (!child.runtime?.instance) {
    const inst = child.factory(child.params);
    child.runtime = { instance: inst };
  }
}

export function unmount(child: ComponentNode<any>) {
  child.runtime?.instance?.componentDidUnmount?.();
  if (child.runtime) child.runtime = undefined
}
