import { command, prompt } from "../../index";

command({
  name: "ask",
  fn: async ({ argv }) => {
    let name = argv[0] || (await prompt("Your name:"));

    let sure = false;
    while (!sure) {
      sure = await prompt.bool(`Are you sure your name is "${name}"?`);

      if (!sure) {
        name = await prompt("Okay, what is your name then?");
      }
    }

    console.log(`Alright! Welcome ${name} :)`);
  },
});
