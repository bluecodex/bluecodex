import { ioc } from "../ioc";
import type { RunTarget } from "./run-target";
import type { SpawnStdOption } from "./spawn-std-option";
import { spawnWithStdOption } from "./spawn-with-std-option";

type Args = {
  runTarget: RunTarget;
  stdOption: SpawnStdOption;
};

export function spawnRunTarget({ runTarget, stdOption }: Args) {
  switch (runTarget.type) {
    case "spawn": {
      console.log(ioc.theme.runSpawn(runTarget.name, runTarget.argv));
      return spawnWithStdOption({
        name: runTarget.name,
        argv: runTarget.argv,
        stdOption,
      });
    }

    case "spawn-package-bin": {
      console.log(ioc.theme.runSpawnPackageBin(runTarget.name, runTarget.argv));
      return spawnWithStdOption({
        name: runTarget.path,
        argv: runTarget.argv,
        stdOption,
      });
    }

    case "command": {
      console.log(ioc.theme.runCommand(runTarget.command, runTarget.argv));
      return spawnWithStdOption({
        name: process.argv0,
        argv: [process.argv[1], runTarget.name, ...runTarget.argv],
        stdOption,
      });
    }

    case "not-found": {
      const notFoundMessage = ioc.theme.runNotFound(runTarget.name);
      process.stderr.write(notFoundMessage + "\n");

      return {
        output: notFoundMessage,
        stdout: "",
        stderr: notFoundMessage,
        exitCode: 1,
        failed: true,
      };
    }
  }
}
