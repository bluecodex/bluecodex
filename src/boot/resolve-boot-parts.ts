export function resolveBootParts(rawArgv: string[]): {
  name: string;
  argv: string[];
  isCommandNotFoundHandle: boolean;
} {
  const [firstArgv, ...remainingArgv] = rawArgv;

  if (!firstArgv)
    return { name: "help", argv: [], isCommandNotFoundHandle: false };

  if (firstArgv === "command_not_found_handle") {
    const [name, ...argv] = remainingArgv;
    return { name, argv, isCommandNotFoundHandle: true };
  }

  return {
    name: firstArgv,
    argv: remainingArgv,
    isCommandNotFoundHandle: false,
  };
}
