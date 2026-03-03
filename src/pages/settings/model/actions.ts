import Router from "@app/providers/router/Router.ts";
import FormValidator from "@shared/lib/validation/FormValidator.ts";
import { RouteLink } from "@shared/types/universal.ts";
import { Button } from "@shared/ui/Button/Button.ts";
import { Subheading } from "@shared/ui/Subheading/Subheading.ts";
import { SettingsPage } from "../ui/SettingsPage.ts";
import { SettingsNodes, SettingsType } from "./types.ts";
import { onBadForm, onGoodForm } from "./utils.ts";

export const handleMessengerClick = () => {
  Router.go(RouteLink.Messenger);
};

export const handleValidateAndSubmit = async (
  type: SettingsType,
  validator: FormValidator,
  btn: Button,
): Promise<void> => {
  const formValid = validator.onFormCheck(type, onBadForm(type));
  if (!formValid) return;

  btn.setProps({
    configs: {
      showSpinner: true,
    },
  });

  await validator.onFormSubmit(type, onGoodForm(type));

  btn.setProps({
    configs: {
      showSpinner: false,
    },
  });
};

export const handleSwitchType = (
  newType: SettingsType,
  newBtn: Button,
  btn: Button,
  mThis: SettingsPage,
) => {
  if (!mThis.children) {
    console.error("SettingsPage: Children are not defined", this);
    return;
  }

  mThis.configs.type = newType;

  const { subheading_form } = mThis.children.nodes as SettingsNodes;

  const subheading = subheading_form.runtime?.instance as Subheading;

  const isInfo = newType === "change-info";
  subheading.setProps({
    configs: {
      i18nKey: isInfo ? "settings.form.subheadingInfo" : "settings.form.subheadingPsw",
    },
  });
  btn.setProps({
    configs: {
      type: "button",
      isSilent: true,
      showSpinner: false,
    },
  });
  newBtn.setProps({
    configs: {
      type: "submit",
      isSilent: false,
      showSpinner: false,
    },
  });

  mThis.setProps({
    on: { submit: newBtn.on?.click },
  });
};
