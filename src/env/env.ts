import { castData } from "../data-type/cast-data";

export function env(name: string): string | null {
  return process.env[name] ?? null;
}

env.boolean = (name: string) => {
  const input = env(name);
  if (input === null) return null;

  return castData({ type: "boolean", input });
};

env.number = (name: string) => {
  const input = env(name);
  if (input === null) return null;

  return castData({ type: "number", input });
};
