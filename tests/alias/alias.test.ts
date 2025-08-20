import { beforeEach, expect, test } from "vitest";

import { alias } from "../../src/alias/alias";
import { command } from "../../src/command/command";
import { ioc } from "../../src/ioc";
import { run } from "../../src/run/run";

beforeEach(() => {
  ioc.registry.enableSelfRegister();
});

test("command", () => {
  command("foo", {}, () => {});
  alias("bar=foo");

  expect(run(""));
});

test("command + argv", () => {});

test("command exists with alias name", () => {});

test("bin", () => {});

test("bin + argv", () => {});

test("local bin", () => {});

test("local bin + argv", () => {});

test("not found", () => {});
