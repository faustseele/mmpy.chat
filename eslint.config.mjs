import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  /* Array of configuration objects,
    prioritizes the last one */
  /* Single configuration object */
  eslint.configs.recommended,

  /* Needs spread to unpack,
    bc it's an array of configuration objects */
  ...tseslint.configs.recommended,

  /* Custom configuration */
  {
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      /* Adds support for global variables */
      globals: {
        ...globals.browser,
        /* Is needed for __dirname in vite.config.js */
        node: true,
      },
    },
    rules: {
      "eol-last": ["warn", "always"],
      "no-unused-vars": "off",
      "no-case-declarations": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "import/extensions": [
        "error",
        "always",
        {
          /* Require .ts for TypeScript files */
          ts: "always",
          /* Require .d.ts for declaration files */
          dts: "always",
        },
      ],
    },
  },
);
