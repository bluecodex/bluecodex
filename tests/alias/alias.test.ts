import { afterEach, beforeEach, test } from "vitest";

import { alias } from "../../src/alias/alias";
import { command } from "../../src/command/command";
import { ioc } from "../../src/ioc";
import { Registry } from "../../src/registry/registry";
import { SpawnStdOption } from "../../src/spawn/spawn-std-option";
import { expectRunSpawnTarget } from "../utils/test-spawn-utils";

beforeEach(() => {
  ioc.registry.enableSelfRegister();
});

afterEach(() => {
  ioc.registry = new Registry();
});

test("command", async () => {
  const cmd = command("foo", {}, () => {});
  alias("bar=foo");

  await expectRunSpawnTarget(
    "bar",
    {
      type: "command",
      name: "bar",
      argv: [],
      command: cmd,
    },
    SpawnStdOption.tty,
  );
});

test.todo("command + argv", () => {});

test.todo("command exists with alias name", () => {});

test.todo("bin", () => {});

test.todo("bin + argv", () => {});

test.todo("local bin", () => {});

test.todo("local bin + argv", () => {});

test.todo("not found", () => {});
