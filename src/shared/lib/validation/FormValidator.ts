import { ApiResponse } from "@shared/api/model/types.ts";
import { InputEditor } from "@features/edit-profile/ui/InputEditor.ts";
import { Input } from "../../ui/Input/Input.ts";
import { FieldType } from "../../ui/Input/types.ts";
import { SubmitTypes } from "./types.ts";
import { validateInputField } from "./utils.ts";

export default class FormValidator {
  private inputs: Input[] | InputEditor[];

  constructor(inputs: Input[] | InputEditor[]) {
    this.inputs = inputs;
  }

  public onInputBlur = (input: Input): void => {
    this._handleFieldValidation(input);
  };

  public onFormCheck = (
    submitType: SubmitTypes,
    badFormCb?: () => void,
  ): boolean => {
    const targetInputs = this._filterInputsBySubmitType(
      submitType,
      this.inputs,
    );
    const formValid = this._handleFormValidation(targetInputs);

    if (!formValid) badFormCb?.();

    return formValid;
  };

  public onFormSubmit = async (
    submitType: SubmitTypes,
    onGoodForm: (
      formData: Record<string, string>,
    ) => Promise<ApiResponse<unknown>>,
  ): Promise<ApiResponse<unknown>> => {
    const targetInputs = this._filterInputsBySubmitType(
      submitType,
      this.inputs,
    );
    const isFormValid = this._handleFormValidation(targetInputs);

    if (isFormValid) {
      const formData = this._getFormData(targetInputs);
      return await onGoodForm(formData);
    } else {
      return { ok: false };
    }
  };

  /* validates all inputs in the form
    and returns if the form is valid */
  private _handleFormValidation(inputs?: Input[] | InputEditor[]): boolean {
    if (!inputs) {
      console.error("FormValidator: Inputs are not defined");
      return false;
    }

    let valid = true;

    inputs.forEach((input) => {
      if (!this._handleFieldValidation(input)) {
        valid = false;
      }
    });

    return valid;
  }

  /* validates a single input component
    and shows/hides its error */
  private _handleFieldValidation(input: Input | InputEditor): boolean {
    if (!input) {
      console.error("FormValidator: Input is not defined");
    }
    const { name, value } = input.getNameAndValue();
    const errorMessage = validateInputField(name, value);

    /* No error message -> input is valid */
    const inputIsValid = !errorMessage;
    input.showError(errorMessage);

    return inputIsValid;
  }

  /* narrows inputs for validation/submission based on submitType */
  private _filterInputsBySubmitType(
    submitType: SubmitTypes,
    inputs: Array<Input | InputEditor>,
  ): Array<Input | InputEditor> {
    const getMeta = (inp: Input | InputEditor) => {
      const { name, value } = inp.getNameAndValue();
      return { name: String(name || ""), value: (value ?? "").trim() };
    };

    if (submitType === "change-info") {
      return inputs.filter((input) => {
        const { name, value } = getMeta(input);
        if (!name) return false;
        return value.length > 0;
      });
    }

    /* default (sign-in/sign-up/edit-info): validate everything */
    return inputs;
  }

  /* collects data from all inputs into a single object */
  private _getFormData(
    inputs: Input[] | InputEditor[],
  ): Record<FieldType, string> {
    const formData: Record<string, string> = {};

    inputs.forEach((input) => {
      const { name, value } = input.getNameAndValue();
      formData[name] = value;
    });

    return formData;
  }
}
