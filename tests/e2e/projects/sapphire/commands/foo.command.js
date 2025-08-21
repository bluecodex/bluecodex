import { command } from "../../../../../src/out/main.js";

command("foo name", ({ name }) => {
  console.log({ name });
});
