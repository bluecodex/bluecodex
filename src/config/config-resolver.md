# Config resolver

The `config-resolver.mjs` file is copied to `~/.config/bluecodex/resolver.mjs`
via the command `blue config` and is responsible for finding the `bluecodex` binary
under multiple situations.

One of the core principals of `bluecodex` is to be flexible enough to be able to fit
into a variety of individual or team workflows. Here are some examples of how it might be used:

### 1. Added as a dependency

```bash
npm install -D bluecodex
npx bluecodex
```

### 2. Added as a dependency then aliased

```bash
npm install -D bluecodex
npx bluecodex config blue
blue ...
```

### 3. Through a linked project

```bash
cd project-a
npm install -D bluecodex
npx bluecodex config blue
source ~/.config/bluecodex/shell.sh
blue link

cd ../project-b
blue ...
```
