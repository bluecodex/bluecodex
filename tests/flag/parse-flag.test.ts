import { test } from "vitest";

import { FlagShortHasMoreThanOneCharError } from "../../src/flag/errors/flag-short-has-more-than-one-char-error";
import { FlagShortMalformattedError } from "../../src/flag/errors/flag-short-malformed-error";
import { createParseFlagMatcher } from "./utils/create-parse-flag-matcher";

test("long name with a single word", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "dev",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--dev");
});

test("long name with dash", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: null,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause");
});

test("long name with underscore", () => {});

test("short name", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "p",
    short: true,
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("-p");
});

test("long name + short", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: "p",
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-p)");
});

test("long name + short + type + required + fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: "p",
    type: "number",
    explicitType: true,
    required: true,
    fallback: 15,
  } as const);

  expectParseFlagMatch("--auto-pause(-p)!:number=15");
});

test("short name + type + required + fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "p",
    short: true,
    type: "number",
    explicitType: true,
    required: true,
    fallback: 111,
  } as const);

  expectParseFlagMatch("-p!:number=111");
});

test("long name with short containing extra invalid character", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: new FlagShortHasMoreThanOneCharError("auto-pause", "(-pb)"),
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-pb)");
});

test("long name with short missing dash", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: new FlagShortMalformattedError("auto-pause", "(a)"),
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(a)");
});

test("long name with short missing letter", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: new FlagShortMalformattedError("auto-pause", "(-)"),
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-)");
});

test("long name with short missing closing parenthesis", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: new FlagShortMalformattedError("auto-pause", "(-p"),
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-p");
});

test("missing closing parenthesis + required + type", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: new FlagShortMalformattedError("auto-pause", "(-p"),
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-p!:number");
});

test("short name with two letters", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "p",
    short: new FlagShortHasMoreThanOneCharError("p", "pb"),
    type: "boolean",
    explicitType: false,
    required: false,
    fallback: null,
  } as const);

  expectParseFlagMatch("-pb");
});
