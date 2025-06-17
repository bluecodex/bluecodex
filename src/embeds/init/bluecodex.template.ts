import { command, prompt } from "../../index";

command("ask name", async ({ name }) => {
  let sure = false;
  while (!sure) {
    sure = await prompt.bool(`Are you sure your name is "${name}"?`);

    if (!sure) {
      name = await prompt("Okay, what is your name then?");
    }
  }

  console.log(`Alright! Welcome ${name} :)`);
});
