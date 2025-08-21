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

/*
 * command
 */

test("command", async () => {
  const cmd = command("foo", {}, () => {});

  expect(await runArgvToSpawnTarget("foo")).toEqual({
    type: "command",
    name: "foo",
    argv: [],
    command: cmd,
  });
});

test("command + argv", async () => {
  const cmd = command("foo", {}, () => {});

  expect(await runArgvToSpawnTarget("foo one two")).toEqual({
    type: "command",
    name: "foo",
    argv: ["one", "two"],
    command: cmd,
  });
});

test("blue prefix uses command even though bin can be found", async () => {
  const cmd = command("echo", {}, () => {});

  expect(await runArgvToSpawnTarget("blue echo hello world")).toEqual({
    type: "command",
    name: "echo",
    argv: ["hello", "world"],
    command: cmd,
  });
});

test("blue prefix uses command even though package bin can be found", async () => {
  const cmd = command("vitest", {}, () => {});

  expect(await runArgvToSpawnTarget("blue vitest one two")).toEqual({
    type: "command",
    name: "vitest",
    argv: ["one", "two"],
    command: cmd,
  });
});

/*
 * bin
 */

test("bin", async () => {
  command("echo", {}, () => {});

  expect(await runArgvToSpawnTarget("echo")).toEqual({
    type: "bin",
    name: "echo",
    argv: [],
  });
});

test("bin + argv", async () => {
  command("echo", {}, () => {});

  expect(await runArgvToSpawnTarget("echo hello world")).toEqual({
    type: "bin",
    name: "echo",
    argv: ["hello", "world"],
  });
});

/*
 * package bin
 */

test("package-bin", async () => {
  command("vitest", {}, () => {});

  expect(await runArgvToSpawnTarget("vitest")).toEqual({
    type: "package-bin",
    name: "vitest",
    path: "node_modules/.bin/vitest",
    argv: [],
  });
});

test("package-bin + argv", async () => {
  command("vitest", {}, () => {});

  expect(await runArgvToSpawnTarget("vitest one two")).toEqual({
    type: "package-bin",
    name: "vitest",
    path: "node_modules/.bin/vitest",
    argv: ["one", "two"],
  });
});

/*
 * alias
 */

test("alias -> command", async () => {
  const cmd = command("foo", {}, () => {});
  alias("bar=foo");

  expect(await runArgvToSpawnTarget("bar one two")).toEqual({
    type: "command",
    name: "foo",
    argv: ["one", "two"],
    command: cmd,
  });
});

test("alias -> command + argv", async () => {
  const cmd = command("foo", {}, () => {});
  alias("bar=foo one two");

  expect(await runArgvToSpawnTarget("bar")).toEqual({
    type: "command",
    name: "foo",
    argv: ["one", "two"],
    command: cmd,
  });
});

test("alias -> alias -> command + argv", async () => {
  const cmd = command("foo", {}, () => {});
  alias("bar=foo one two");
  alias("baz=bar three");

  expect(await runArgvToSpawnTarget("baz four")).toEqual({
    type: "command",
    name: "foo",
    argv: ["one", "two", "three", "four"],
    command: cmd,
  });
});

test("alias -> bin", async () => {
  alias("show=echo");

  expect(await runArgvToSpawnTarget("show")).toEqual({
    type: "bin",
    name: "echo",
    argv: [],
  });
});

test("alias -> bin + argv", async () => {
  alias("show=echo one");

  expect(await runArgvToSpawnTarget("show two")).toEqual({
    type: "bin",
    name: "echo",
    argv: ["one", "two"],
  });
});

test("alias -> alias -> bin + argv", async () => {
  alias("show=echo one");
  alias("show2=show two");

  expect(await runArgvToSpawnTarget("show2 three")).toEqual({
    type: "bin",
    name: "echo",
    argv: ["one", "two", "three"],
  });
});

/*
 * not found
 */

test("not found", async () => {
  command("foo", {}, () => {});
  alias("bar=foo");

  expect(await runArgvToSpawnTarget("baz one two three")).toEqual({
    type: "not-found",
    name: "baz",
    argv: ["one", "two", "three"],
  });
});
