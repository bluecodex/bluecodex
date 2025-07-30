# blue codex

**blue** _codex_ is a knowledge toolkit for dev teams. You can find docs at https://bluecodex.dev/.

In this folder you'll find commands that will help you with daily tasks on this project.

## Installing

**blue** _codex_ is installed as a npm package, which means just have to install your packages.

Once installed `bluecodex` will be available via your package manager's run command such as `npm run bluecodex`.

## Setup yourself up

You might run `bluecodex` several times a day and typing out `npm run bluecodex` might get a bit tedious.

For an optimal experience we recommend setting up some shortcuts. We have a command to guide you through the options.

```sh
npm run bluecodex me
```

## How to use it

From now on we'll assume your have your alias setup and calling `blue` works on your terminal. 

### Listing commands available

```bash
blue
```

### Creating a command

All with `.blue/**/*.blue.{ts,tsx}` are sourced automatically. To create a new command just create a
new file and call `command()`

```typescript
import { command } from 'bluecodex';

command('component:new name --domain:string', ({ name, domain }) => {
    
})
```

Arguments and flag types are parsed and the data is available at your function.

If the user does not provide the necessary data, **blue** _codex_ will automatically ask the dev
invoking the command for the missing data.

For more information visit https://bluecodex.dev/

### Running a command

Let's use the example from the section above: `component:new name --domain(-d):string`

Here's how you might call it:

```bash
blue component:new password-input --domain=auth
```
