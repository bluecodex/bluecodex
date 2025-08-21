import { findUp } from "find-up-simple";
import path from "node:path";

export async function findProjectRoot() {
  const nodeModulesPath = await findUp("node_modules");
  return nodeModulesPath ? path.dirname(nodeModulesPath) : null;
}
