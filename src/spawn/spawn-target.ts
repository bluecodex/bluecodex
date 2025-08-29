import type { Command } from "../command/command";
import { ioc } from "../ioc";
import type { SpawnResult } from "./spawn-result";
import type { SpawnStdOption } from "./spawn-std-option";
import { spawnWithStdOption } from "./spawn-with-std-option";

export type SpawnTarget =
  | { type: "command"; name: string; argv: string[]; command: Command }
  | { type: "bin"; name: string; argv: string[] }
  | { type: "package-bin"; name: string; path: string; argv: string[] }
  | { type: "not-found"; name: string; argv: string[] };

export function spawnTarget(
  target: SpawnTarget,
  stdOption: SpawnStdOption,
): Promise<SpawnResult> {
  switch (target.type) {
    case "bin": {
      console.log(ioc.theme.runSpawn(target.name, target.argv));
      return spawnWithStdOption({
        name: target.name,
        argv: target.argv,
        stdOption,
      });
    }

    case "package-bin": {
      console.log(ioc.theme.runSpawnPackageBin(target.name, target.argv));
      return spawnWithStdOption({
        name: target.path,
        argv: target.argv,
        stdOption,
      });
    }

    case "command": {
      console.log(ioc.theme.runCommand(target.command, target.argv));
      return spawnWithStdOption({
        name: process.env.tsxFilename!,
        argv: [process.argv[1], target.name, ...target.argv],
        stdOption,
      });
    }

    case "not-found": {
      const notFoundMessage = ioc.theme.runNotFound(target.name);
      process.stderr.write(notFoundMessage + "\n");

      return Promise.resolve({
        __objectType__: "spawn-result",
        rawAll: notFoundMessage,
        rawStdout: "",
        rawStderr: notFoundMessage,
        exitCode: 1,
        failed: true,
      });
    }
  }
}
