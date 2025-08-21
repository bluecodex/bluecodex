import { fyle } from "../fyle/fyle";

export async function getBinBindPath(projectRoot: string) {
  const binFile = fyle(projectRoot, "node_modules/.bin/bluecodex");
  if (await binFile.exists()) return binFile.path;

  return null;
}
