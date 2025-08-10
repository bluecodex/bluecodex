import prompts from "prompts";

// =============================================================================
// Note:
// Currently these prompts use the library `prompts` internally.
//
// The `prompts` library offer a reasonable set of well-built prompts and, until
// bluecodex is mature enough to justify having its own prompts, we'll defer
// to using `prompts` or some other library.
// =============================================================================

function onCancel() {
  process.exit(0);
}

export async function prompt(
  message: string,
  options?: {
    /**
     * Default initial value
     */
    initial?: string;

    /**
     * Receive user input. Should return true if the value is valid, and an
     * error message String otherwise. If false is returned, a default error
     * message is shown
     */
    validate?: (value: string) => boolean | string;
  },
): Promise<string> {
  const { value } = await prompts(
    {
      type: "text",
      name: "value",
      message,
      initial: options?.initial,
      validate: options?.validate,
    },
    { onCancel },
  );

  return value;
}

prompt.confirm = async (
  message: string,
  options?: {
    /**
     * Default initial value
     */
    initial?: boolean;
  },
): Promise<boolean> => {
  const { value } = await prompts(
    {
      type: "confirm",
      name: "value",
      message,
      initial: options?.initial ?? true,
    },
    { onCancel },
  );

  return value;
};

prompt.number = async (
  message: string,
  options?: {
    /**
     * Default initial value
     */
    initial?: number;

    /**
     * Receive user input. Should return true if the value is valid, and an
     * error message String otherwise. If false is returned, a default error
     * message is shown
     */
    validate?: (value: string) => boolean | string;

    /**
     * Min value. Defaults to -infinity
     */
    min?: number;

    /**
     * Max value. Defaults to Infinity
     */
    max?: number;

    /**
     * Allow floating point inputs. Defaults to false
     */
    float?: boolean | { decimalPlaces: number };

    /**
     * Increment step when using arrow keys. Defaults to 1
     */
    increment?: number;
  },
): Promise<number> => {
  const { value } = await prompts(
    {
      type: "number",
      name: "value",
      message,
      initial: options?.initial ?? options?.min ?? 0,
      validate: options?.validate,
      min: options?.min,
      max: options?.max,
      float: Boolean(options?.float),
      round:
        typeof options?.float === "object"
          ? options.float.decimalPlaces
          : undefined,
      increment: options?.increment,
    },
    { onCancel },
  );

  return value;
};

// Select

type PromptSelectChoice<TValue extends string> =
  | TValue
  | {
      title?: string;
      value: TValue;
      description?: string;
      disabled?: boolean;
    };

prompt.select = async <TValue extends string>(
  message: string,
  choices: PromptSelectChoice<TValue>[],
  options?: {
    /**
     * Default initial value
     */
    initial?: string;

    /**
     * Hint to display to the user
     */
    hint?: string;

    /**
     * Message to display when selecting a disabled option
     */
    warn?: string;
  },
): Promise<TValue> => {
  const mappedChoices = choices.map((choice) =>
    typeof choice === "string"
      ? { title: choice, value: choice }
      : {
          title: choice.title ?? choice.value,
          value: choice.value,
          description: choice.description,
          disabled: choice.disabled,
        },
  );

  const { value } = await prompts(
    {
      type: "select",
      name: "value",
      message,
      choices: mappedChoices,
      initial: options?.initial
        ? mappedChoices.findIndex((choice) => choice.value === options.initial)
        : 0,
      hint: options?.hint,
      warn: options?.warn,
    },
    { onCancel },
  );

  return value;
};

// Autocomplete

type PromptAutocompleteChoice<TValue extends string> =
  | TValue
  | {
      title?: string;
      value: TValue;
      description?: string;
    };

/**
 * Similar to `select` but does not support hints and disabled choices
 */
prompt.autocomplete = async <TValue extends string>(
  message: string,
  choices: PromptAutocompleteChoice<TValue>[],
  options?: {
    /**
     * Default initial value
     */
    initial?: string;

    /**
     * Filter function. Defaults to sort by title property. Filters using title
     * by default
     */
    suggest?: (
      input: string,
      choices: PromptSelectChoice<TValue>[],
    ) => PromptSelectChoice<TValue>[] | Promise<PromptSelectChoice<TValue>[]>;

    /**
     * Max number of results to show. Defaults to 10
     */
    limit?: number;

    /**
     * Fallback message when no match is found. Defaults to initial value if
     * provided
     */
    fallback?: string;
  },
): Promise<TValue> => {
  const mappedChoices = choices.map((choice) =>
    typeof choice === "string"
      ? { title: choice, value: choice }
      : {
          title: choice.title ?? choice.value,
          value: choice.value,
          description: choice.description,
        },
  );

  const { value } = await prompts(
    {
      type: "autocomplete",
      name: "value",
      // @ts-expect-error prompts types have not been updated yet
      clearFirst: true,
      message,
      choices: mappedChoices,
      initial: options?.initial
        ? mappedChoices.findIndex((choice) => choice.value === options.initial)
        : 0,
      suggest: options?.suggest
        ? async (input) => {
            const suggestions = await options.suggest!(input, mappedChoices);
            return suggestions;
          }
        : undefined,
      limit: options?.limit,
      fallback: options?.fallback,
    },
    { onCancel },
  );

  return value;
};
