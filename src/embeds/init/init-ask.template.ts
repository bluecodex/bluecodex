import { ask, command } from "../../out/main";

command("ask name", async ({ name }) => {
  let sure = false;
  while (!sure) {
    sure = await ask.bool(`Are you sure your name is "${name}"?`);

    if (!sure) {
      name = await ask("Okay, what is your name then?");
    }
  }

  console.log(`Alright! Welcome ${name} :)`);
});
