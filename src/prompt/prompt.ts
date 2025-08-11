import prompts from "prompts";

// =============================================================================
// Note:
// Currently these prompts use the library `prompts` internally.
//
// The `prompts` library offer a reasonable set of well-built prompts and, until
// bluecodex is mature enough to justify having its own prompts, we'll defer
// to using `prompts` or some other library.
// =============================================================================

export async function prompt(
  message: string,
  options?: {
    initial?: string;
    validate?: (value: string) => boolean | string;
  },
): Promise<string> {
  const { value } = await prompts({
    type: "text",
    name: "value",
    message,
    initial: options?.initial,
    validate: options?.validate,
  });

  if (typeof value === "undefined") process.exit(1);

  return value;
}

prompt.confirm = async (
  message: string,
  options?: {
    initial?: boolean;
  },
): Promise<boolean> => {
  const { value } = await prompts({
    type: "confirm",
    name: "value",
    message,
    initial: options?.initial ?? true,
  });

  if (typeof value === "undefined") process.exit(1);

  return value;
};

prompt.number = async (
  message: string,
  options?: {
    initial?: number;
    validate?: (value: string) => boolean | string;
    min?: number;
    max?: number;
    float?: boolean | { decimalPlaces: number };
    step?: number;
  },
): Promise<number> => {
  const { value } = await prompts({
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
    increment: options?.step,
  });

  if (typeof value === "undefined") process.exit(1);

  return value;
};

// Select

type PromptSelectChoice<TValue extends string> =
  | TValue
  | {
      title?: string;
      value: TValue;
      description?: string;
    };

prompt.select = async <TValue extends string>(
  message: string,
  choices: PromptSelectChoice<TValue>[],
  options?: {
    initial?: TValue;
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

  const { value } = await prompts({
    type: "autocomplete",
    name: "value",
    // @ts-expect-error prompts types have not been updated yet
    clearFirst: true,
    message,
    choices: mappedChoices,
    initial: options?.initial ?? 0,
  });

  if (typeof value === "undefined") process.exit(1);

  return value;
};
