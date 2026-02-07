import { globalBus } from "@/shared/lib/EventBus/EventBus.ts";
import { cx } from "@/shared/lib/helpers/formatting/classnames.ts";
import Component from "@shared/lib/Component/model/Component.ts";
import { ComponentProps } from "@shared/lib/Component/model/types.ts";
import css from "./toast.module.css";
import { ToastPayload, ToastProps } from "./types.ts";

export class Toast extends Component<ToastProps> {
  private timerId: ReturnType<typeof setTimeout> | undefined;

  constructor(props: ComponentProps<ToastProps, Toast>) {
    super(props);
  }

  public getRootTagCx(configs?: ToastProps["configs"]): string {
    const { type, show } = configs ?? this.configs;
    return cx(
      css.toast,
      type === "error" && css.toast_error,
      type === "success" && css.toast_success,
      show && css.toast_visible,
    );
  }

  public componentDidMount(): void {
    /* mounting Toast to globalBus */
    globalBus.on("toast", (payload: ToastPayload) =>
      this.showToast(payload),
    );
  }

  public componentDidRender(): void {
    if (!this.element) {
      console.error("Toast: element is not defined", this.domService);
      return;
    }
    this.element.textContent = this.configs.msg;
  }

  public showToast({ msg, type = "info" }: ToastPayload): void {
    if (!this.element) return;

    /* clear timer if toast active */
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = undefined;

      this.setProps({
        configs: {
          show: false,
        },
      });
    }

    /* timeout needed to allow hide-anim on clearTimeout() to complete */
    setTimeout(() => {
      this.setProps({
        configs: {
          msg,
          type,
          show: true,
        },
      });

      /* auto-hide after 2s */
      this.timerId = setTimeout(() => {
        this.timerId = undefined;
        this.setProps({
          configs: {
            show: false,
          },
        });
      }, 2000);
    }, 300);
  }
  public getInnerMarkup(): string {
    return /*html*/ ``;
  }
}
