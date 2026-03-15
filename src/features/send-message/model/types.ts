import { ChatId } from "@shared/api/model/api.types.ts";
import {
  BaseConfigs,
  BaseProps,
} from "@shared/lib/Component/model/base.types.ts";
import { RootTag } from "@shared/lib/DOM/types.ts";

export interface MessageFieldProps extends BaseProps {
  configs: MessageFieldConfigs;
  on: {
    submit: (e: Event, chatId: ChatId) => void;
  };
}

export interface MessageFieldConfigs extends BaseConfigs {
  id: string;
  chatId?: ChatId;
  rootTag: Extract<RootTag, "form">;
  classNames: string;
  label: string;
  type: "text";
  placeholder?: string;
}
