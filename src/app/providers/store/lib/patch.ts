import { isPlainObject } from "@shared/lib/helpers/object/utils.ts";

export function getProjection<TShape extends Record<string, unknown>>(
  current: unknown,
  patch: TShape,
): TShape {
  const out: Record<string, unknown> = {};

  for (const [key, shapeVal] of Object.entries(patch)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currVal = (current as any)?.[key];

    if (isPlainObject(shapeVal)) {
      out[key] = getProjection(currVal, shapeVal as Record<string, unknown>);
    } else {
      /* non-objs (arrs/fns/prims) -> take current value */
      out[key] = currVal;
    }
  }

  return out as TShape;
}
