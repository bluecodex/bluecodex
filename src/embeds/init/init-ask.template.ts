import { command, prompt } from "../../out/main";

command("foo bar", async ({ bar }) => {
  let sure = false;
  while (!sure) {
    sure = await prompt.confirm(`Are you sure that bar is "${bar}"?`);

    if (!sure) {
      bar = await prompt("Okay, what is the correct bar then?");
    }
  }

  console.log(`Alright! Foo ${bar} :)`);
});
