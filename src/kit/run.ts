import { execa } from "execa";

import type { RawCmd } from "../cli/raw-cmd";
import { rawCmdTarget } from "../cli/raw-cmd-target";
import { ioc } from "../ioc";

export type RunResult = {
  output: string;
  stdout: string;
  stderr: string;
  exitCode: number | undefined;
};

/**
 * Runs a command asynchronously and returns the exit code
 */
export async function run(rawCmd: RawCmd): Promise<RunResult> {
  const target = rawCmdTarget(rawCmd);

  let name: string;
  let argv: string[];

  switch (target.type) {
    case "spawn": {
      name = target.name;
      argv = target.argv;

      console.log(ioc.theme.runSpawn(target.name, target.argv));
      break;
    }

    case "spawn-package-bin": {
      name = target.name;
      argv = target.argv;

      console.log(ioc.theme.runSpawnPackageBin(target.name, target.argv));
      break;
    }

    case "command": {
      name = process.argv0;
      argv = [process.argv[1], target.name, ...target.argv];

      console.log(ioc.theme.runCommand(target.command!, target.argv));
      break;
    }

    case "not-found": {
      const notFoundMessage = ioc.theme.runNotFound(target.name);
      process.stderr.write(notFoundMessage + "\n");

      return {
        output: notFoundMessage,
        stdout: "",
        stderr: notFoundMessage,
        exitCode: 1,
      };
    }
  }

  const { stdout, stderr, all, exitCode, originalMessage } = await execa(
    name,
    argv,
    {
      all: true,
      stdin: ["inherit"],
      stdout: ["pipe", "inherit"],
      stderr: ["pipe", "inherit"],
      reject: false,
      env: { FORCE_COLOR: "1" },
    },
  );

  if (originalMessage) {
    process.stderr.write(originalMessage);
  }

  return {
    output: (all ?? "") as string,
    stdout: stdout as string,
    stderr: stderr as string,
    exitCode,
  };
}
