# blue codex

**blue** _codex_ is a knowledge toolkit for dev teams. You can find docs at https://bluecodex.dev/.

In this folder you'll find commands that will help you with daily tasks on this project.

## Installing

**blue** _codex_ is installed as a npm package, which means just have to install your packages.

Once installed `blue` will be available via your package manager's run command such as `npm run blue`.

## Setup alias

You might run `blue` several times a day. For an optimal experience we recommend setting `blue` as an alias.

To achieve that either:

- run `npm run blue alias` _(or equivalent for your package manager)_
- or manually add `alias blue="node_modules/.bin/blue"` to your terminal profile

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

Arguments and flag types are parsed automatically and the data is available for your function.

If the user does not provide the necessary data, **blue** _codex_ will automatically prompt the dev
invoking the command for the missing data.

For more information visit https://bluecodex.dev/

### Running a command

Let's use the example from the section above: `component:new name --domain(-d):string`

Here's how you might call it:

```bash
blue component:new password-input --domain=auth
```
