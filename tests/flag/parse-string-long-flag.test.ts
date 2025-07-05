import { test } from "vitest";

import { FlagShortHasMoreThanOneCharError } from "../../src/flag/errors/flag-short-has-more-than-one-char-error";
import { FlagShortMalformattedError } from "../../src/flag/errors/flag-short-malformed-error";
import { createParseFlagMatcher } from "./utils/create-parse-flag-matcher";

test("long with type and fallback", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: false,
    fallback: 123,
  } as const);

  expectParseFlagMatch("--auto-pause:number=123");
});

test("required long with type", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: null,
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause!:number");
});

test("required long with alisa and type", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: "a",
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-a)!:number");
});

test("long with short containing extra invalid character", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: new FlagShortHasMoreThanOneCharError("auto-pause", "(-ab)"),
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-ab)!:number");
});

test("long with short missing dash", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: new FlagShortMalformattedError("auto-pause", "(a)"),
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(a)!:number");
});

test("long with short missing letter", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: new FlagShortMalformattedError("auto-pause", "(-)"),
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-)!:number");
});

test("missing closing parenthesis", () => {
  const { expectParseFlagMatch } = createParseFlagMatcher({
    name: "auto-pause",
    short: new FlagShortMalformattedError("auto-pause", "(-a"),
    type: "number",
    explicitType: true,
    required: true,
    fallback: null,
  } as const);

  expectParseFlagMatch("--auto-pause(-a!:number");
});
