import { Indexed, PlainObject } from "@shared/types/universal.ts";

/**
 * filtering out: primitives;
 * nulls; funcs & arrs;
 * built-in objs */
export function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === "object" &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

export function isArrayOrObject(value: unknown): value is [] | PlainObject {
  return isPlainObject(value) || Array.isArray(value);
}

/** performs a deep comparison of two plain-objs/arrays;
 * it first checks key counts, then recurses into nested
 * arrays or objects via isArrayOrObject,
 * falling back to strict equality for primitives */
export function isEqual(lhs: Indexed, rhs: Indexed) {
  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return false;
  }

  for (const [key, value] of Object.entries(lhs)) {
    const rightValue = rhs[key];
    if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
      if (isEqual(value as Indexed, rightValue as Indexed)) {
        continue;
      }
      return false;
    }

    if (value !== rightValue) {
      return false;
    }
  }

  return true;
}
