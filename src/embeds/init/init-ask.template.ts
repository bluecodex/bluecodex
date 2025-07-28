import { ask, command } from "../../out/main";

command("foo bar", async ({ bar }) => {
  let sure = false;
  while (!sure) {
    sure = await ask.bool(`Are you sure that bar is "${bar}"?`);

    if (!sure) {
      bar = await ask("Okay, what is the correct bar then?");
    }
  }

  console.log(`Alright! Foo ${bar} :)`);
});
