import { describe, expect, it } from "vitest";
import { EMAIL_ERROR, LOGIN_ERROR, PASSWORD_ERROR } from "./consts.ts";
import { validateInputField } from "./utils.ts";

describe("Shared/Lib: Validation", () => {
  /* email validation */
  describe("Field: Email", () => {
    it.each([
      /* valid */
      ["test@example.com", ""],
      ["user.name@domain.co.uk", ""],
      ["user-name@domain.com", ""],
      /* invalid */
      ["plainaddress", EMAIL_ERROR],
      ["@missinguser.com", EMAIL_ERROR],
      ["username@.com", EMAIL_ERROR],
      ["user@domain", EMAIL_ERROR], // missing Top-Level-Domain
    ])("should validate %s as %s", (email, expectedErr) => {
      expect(validateInputField("email", email)).toBe(expectedErr);
    });
  });

  /* password validation */
  describe("Field: Password", () => {
    it.each([
      /* valid */
      ["Password123", ""],
      ["HardP@ssw0rd", ""],
      /* invalid */
      ["password123", PASSWORD_ERROR], // no uppercase
      ["Password", PASSWORD_ERROR], // no digit
      ["12345678", PASSWORD_ERROR], // no letters
      ["Pass1", PASSWORD_ERROR], // too short (<8)
    ])("should validate password rules for '%s'", (password, expectedErr) => {
      expect(validateInputField("password", password)).toBe(expectedErr);
    });
  });

  /* login validation */
  describe("Field: Login", () => {
    it.each([
      /* valid */
      ["Ivan", ""],
      ["Иван", ""], // cyrillic check
      ["Anna-Maria", ""],
      /* invalid */
      ["ivan", LOGIN_ERROR], // lowercase start
      ["иван", LOGIN_ERROR], // lowercase cyrillic start
      ["Ivan123", LOGIN_ERROR], // digits
      ["Ivan The Great", LOGIN_ERROR], // spaces
    ])("should validate login rules for '%s'", (login, expectedErr) => {
      expect(validateInputField("login", login)).toBe(expectedErr);
    });
  });
});
