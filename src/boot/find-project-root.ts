import { file } from "../file/file";

export async function findProjectRoot() {
  const cwd = process.cwd();

  for (let i = 0; i < 5; i++) {
    const f = file(cwd, "../".repeat(i), "node_modules");
    if (await f.exists()) return f.dirname;
  }

  return null;
}
