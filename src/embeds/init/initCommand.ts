import * as fs from "node:fs";
import * as path from "node:path";

import { command } from "../../command";

export const initCommand = command("init", () => {
  const contents = fs
    .readFileSync(path.join(__dirname, "bluecodex.template.ts"), "utf-8")
    .replace('from "../../out/main";', 'from "bluecodex";');

  const destination = path.join(process.cwd(), "bluecodex.ts");
  fs.writeFileSync(destination, contents);

  console.log(`${destination} created`);
});
