// =============================================================================
// Currently these prompts use the library `inquirer` internally.
//
// This library offer a reasonable set of well-built prompts and, until
// bluecodex is mature enough to justify having its own prompts, we'll defer
// to using a library.
// =============================================================================
import * as inquirer from "@inquirer/prompts";

/*
 * Text
 */

export async function prompt(
  message: string,
  options?: {
    initial?: string;
    validate?: (value: string) => boolean | Promise<boolean>;
  },
): Promise<string> {
  try {
    const value = await inquirer.input({
      message,
      default: options?.initial,
      required: true,
      // TODO: try/catch and return error as message
      validate: options?.validate,
    });

    return value;
  } catch {
    // TODO: check error type
    process.exit(1);
  }
}

/*
 * Confirm
 */

prompt.confirm = async (
  message: string,
  options?: {
    initial?: boolean;
  },
): Promise<boolean> => {
  try {
    const value = await inquirer.confirm({
      message,
      default: options?.initial ?? true,
    });

    return value;
  } catch {
    // TODO: check error type
    process.exit(1);
  }
};

/*
 * Number
 */

prompt.number = async (
  message: string,
  options?: {
    initial?: number;
    validate?: (value: number) => boolean | Promise<boolean>;
    min?: number;
    max?: number;
    step?: number;
  },
): Promise<number> => {
  try {
    const value = await inquirer.number({
      message,
      default: options?.initial ?? options?.min,
      required: true,
      // TODO: try/catch and return error as message
      validate: options?.validate,
      min: options?.min,
      max: options?.max,
      step: options?.step,
    });

    return value;
  } catch {
    // TODO: check error type
    process.exit(1);
  }
};

// Select

prompt.select = async <Value extends string>(
  message: string,
  choices: Array<
    Value | { value: Value; title?: string; description?: string }
  >,
  options?: { initial?: Value },
): Promise<Value> => {
  const mappedChoices = choices.map((choice) =>
    typeof choice === "string"
      ? { value: choice }
      : {
          name: choice.title,
          value: choice.value,
          description: choice.description,
        },
  );

  try {
    const value = await inquirer.select({
      message,
      choices: mappedChoices,
      default: options?.initial,
    });

    return value;
  } catch {
    // TODO: check error type
    process.exit(1);
  }
};
