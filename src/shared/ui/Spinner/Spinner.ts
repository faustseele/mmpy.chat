import { cx } from "@/shared/lib/helpers/formatting/classnames.ts";
import Component from "@shared/lib/Component/model/Component.ts";
import { ComponentProps } from "@shared/lib/Component/model/types.ts";
import css from "./spinner.module.css";
import { SpinnerProps } from "./types.ts";

export class Spinner extends Component<SpinnerProps> {
  constructor(props: ComponentProps<SpinnerProps, Spinner>) {
    super(props);
  }

  public componentDidRender(): void {
    console.log("Spinner");
  }

  public getRootTagCx(): string {
    const { isBig, isOn } = this.configs;
    return cx(css.spinner, isBig && css.spinner_big, !isOn && css.spinner_off);
  }

  public getInnerMarkup(): string {
    return /*html*/ ``;
  }
}
