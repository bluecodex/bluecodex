import { assertBlueprintIsValid } from "../blueprint/assert-blueprint-is-valid";
import type { Command } from "../command/command";
import type { DataTypeSchema } from "../data-type/data-type-schema";
import { ioc } from "../ioc";
import { parseArgv } from "../parse-argv/parse-argv";
import { promptField } from "../prompt/prompt-field";

export async function runCommand(
  command: Command,
  argv: string[],
): Promise<number> {
  assertBlueprintIsValid(command.blueprint);

  const parsedArgv = parseArgv({
    argv,
    blueprint: command.blueprint,
    schema: command.schema,
  });
  const { data } = parsedArgv;

  if (parsedArgv.type === "error") {
    parsedArgv.errors.forEach((error) => {
      console.log(
        ioc.theme.styleDim("  └ ") +
          ioc.theme.styleWarning(error.field.name) +
          ioc.theme.styleDim(`: ${error.reason}`),
      );
    });

    console.log(""); // some breathing room

    for (const error of parsedArgv.errors) {
      const field = error.field;
      const schema = (command.schema[field.name] ?? {}) as DataTypeSchema;
      data[field.name] = await promptField({ field, schema });
    }
  }

  try {
    const response = await command.fn({ argv, ...data } as any);

    // If an exit code number is returned, use it
    if (typeof response === "number") return response;

    // If it's a boolean, true means success and false means failure
    if (typeof response === "boolean") return response ? 0 : 1;

    // If it's a run-result, use the exit code
    if (
      response &&
      typeof response === "object" &&
      (response.__objectType__ === "run-result" ||
        response.__objectType__ === "run-result-with-output")
    )
      return response.exitCode ?? 0;

    return 0;
  } catch (error) {
    process.stderr.write(
      ((error as Error).stack ?? (error as Error).message) + "\n",
    );
    return 1;
  }
}
