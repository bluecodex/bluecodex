import type { Command } from "../command/command";

export type RunTarget =
  | { type: "command"; name: string; argv: string[]; command: Command }
  | { type: "spawn"; name: string; argv: string[] }
  | { type: "spawn-package-bin"; name: string; path: string; argv: string[] }
  | { type: "not-found"; name: string };
