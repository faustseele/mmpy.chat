import { FieldType } from "../../ui/Input/types.ts";
import {
  DISPLAY_NAME_ERROR,
  DISPLAY_NAME_REGEX,
  EMAIL_ERROR,
  EMAIL_REGEX,
  LOGIN_ERROR,
  LOGIN_REGEX,
  NAME_ERROR,
  NAME_REGEX,
  PASSWORD_ERROR,
  PASSWORD_REGEX,
  PHONE_ERROR,
  PHONE_REGEX,
  SURNAME_ERROR,
  SURNAME_REGEX,
} from "./consts.ts";

/** 'Ё' Char has U+0401, whereas 'А-Я' range includes
 * symbols from U+0410 up to U+042F. Same thing for 'ё'!
 * Eslint is wrongly complaining about unused vars */

// eslint-disable-next-line no-unused-vars
const getRegex: Record<FieldType, (value: string) => string> = {
  name: (value: string): string => {
    return NAME_REGEX.test(value) ? "" : NAME_ERROR;
  },
  surname: (value: string): string => {
    return SURNAME_REGEX.test(value) ? "" : SURNAME_ERROR;
  },
  login: (value: string): string => {
    return LOGIN_REGEX.test(value) ? "" : LOGIN_ERROR;
  },
  email: (value: string): string => {
    return EMAIL_REGEX.test(value) ? "" : EMAIL_ERROR;
  },
  password: (value: string): string => {
    return PASSWORD_REGEX.test(value) ? "" : PASSWORD_ERROR;
  },
  phone: (value: string): string => {
    return PHONE_REGEX.test(value) ? "" : PHONE_ERROR;
  },
  display_name: (value: string): string => {
    return DISPLAY_NAME_REGEX.test(value) ? "" : DISPLAY_NAME_ERROR;
  },
  message: (value: string): string => {
    return value.length > 0 ? "" : "Напишите что-нибудь.";
  },
  search: (value: string): string => {
    return value.length > 0 ? "" : "Напишите что-нибудь.";
  },
  oldPassword: (value: string): string => {
    return PASSWORD_REGEX.test(value) ? "" : PASSWORD_ERROR;
  },
  newPassword: (value: string): string => {
    return PASSWORD_REGEX.test(value) ? "" : PASSWORD_ERROR;
  },
};

/**
 * Validates a value based on the field name.
 * @param fieldName The name of the field to validate (e.g., 'login', 'password').
 * @param value The value to validate.
 * @returns An empty string if valid, or an error message string if invalid.
 */
export function validateInputField(
  fieldName: FieldType | "",
  value?: string,
): string {
  if (!fieldName) return "";
  if (!value) return "Заполните поле.";
  return getRegex[fieldName](value);
}
