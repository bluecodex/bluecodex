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
    const stackLines = error.stack.split("\n");
    if (stackLines[0].includes(functionName)) stackLines.shift();
    newError.stack = [newError.toString(), ...stackLines.slice(1)].join("\n");
  }

  throw newError;
}
