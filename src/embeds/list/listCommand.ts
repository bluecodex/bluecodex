import { command } from "../../command";

export const listCommand = command({
  name: "list",
  fn: () => {
    console.log("Welcome to bluecodex!");
  },
});
