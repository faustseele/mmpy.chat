import { Indexed } from "@shared/types/universal.ts";

/**
 * recursively merges two indexable objects;
 * descends into nested plain-objs and overwrites other values, returning the mutated `lhs`;
 * it’s designed to support shallow/deep upds via dot-paths */
export function merge(lhs: Indexed, rhs: Indexed): Indexed {
  for (const p in rhs) {
    if (!rhs.hasOwnProperty!(p)) {
      continue;
    }

    try {
      if (rhs[p]!.constructor === Object) {
        rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
      } else {
        lhs[p] = rhs[p];
      }
    } catch (_) {
      lhs[p] = rhs[p];
    }
  }

  return lhs;
}

/**
 * builds a nested obj from a dot-delimited path (using reduceRight);
 * merges it into the orig-obj with merge,
 * enabling store.set("user.name", value)-style updates */
export function set(
  object: Indexed | unknown,
  path: string,
  value: unknown,
): Indexed | unknown {
  if (typeof object !== "object" || object === null) {
    return object;
  }

  if (typeof path !== "string") {
    throw new Error("Path must be a string");
  }

  const result = path.split(".").reduceRight<Indexed>(
    (acc, key) => ({
      [key]: acc,
    }),
    value as Indexed,
  );

  return merge(object as Indexed, result);
}

