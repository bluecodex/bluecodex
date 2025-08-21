/**
 * Filter out a function from the stack trace to avoid
 */
export function skipCustomFunctionInStackTrace(
  error: Error,
  functionName: string,
) {
  const newError = new Error(error.message);
  newError.name = error.name;

  if (error.stack) {
    const stackLines = error.stack
      .split("\n")
      .filter((line) => !line.includes(functionName));
    newError.stack = [newError.toString(), ...stackLines.slice(1)].join("\n");
  }

  throw newError;
}
