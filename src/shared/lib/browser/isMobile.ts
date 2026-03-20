import { mobileString } from "./const.ts";

export const isMobile = (): boolean => {
  if (typeof navigator === "undefined" || typeof window === "undefined")
    return false;

  /* touch — maxTouchPoints excluded: Firefox desktop falsely reports > 0 */
  if ("ontouchstart" in window) return true;

  /* pointer is coarse */
  if (matchMedia("(pointer: coarse)").matches) return true;

  /* UA client hints */
  if ("userAgentData" in navigator) {
    const uaData = navigator.userAgentData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((uaData as any).mobile) return true;
  }

  /* regex */
  const ua = navigator.userAgent;
  if (mobileString.test(ua)) return true;

  return false;
};
