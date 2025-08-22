import { configFile } from "./config-file";

export async function saveBluecodexConfigShFile(aliasName: string) {
  const resolverJsFile = configFile("resolver.mjs");

  const shellShFile = configFile("shell.sh");
  await shellShFile.save([`alias ${aliasName}="${resolverJsFile.tildePath}"`]);
}
