import { configFile } from "../config/config-file";

export function getLinksFile() {
  return configFile("links.txt");
}
