import { afterEach, beforeEach, expect, test } from "vitest";

import { alias } from "../../../src/alias/alias";
import { command } from "../../../src/command/command";
import { ioc } from "../../../src/ioc";
import { Registry } from "../../../src/registry/registry";
import { runArgvToSpawnTarget } from "../../../src/run/run-argv-to-spawn-target";

beforeEach(() => {
  ioc.registry.enableSelfRegister();
});

afterEach(() => {
  ioc.registry = new Registry();
});

test("command", async () => {
  const cmd = command("foo", {}, () => {});
  alias("bar=foo");

  expect(await runArgvToSpawnTarget("bar")).toEqual({
    type: "command",
    name: "bar",
    argv: [],
    command: cmd,
  });
});

test.todo("command + argv", () => {});

test.todo("command exists with alias name", () => {});

test.todo("bin", () => {});

test.todo("bin + argv", () => {});

test.todo("local bin", () => {});

test.todo("local bin + argv", () => {});

test.todo("not found", () => {});
