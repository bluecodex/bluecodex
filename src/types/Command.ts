export type CommandFn = (data: { argv: string[] }) => unknown;

export type Command = {
  name: string;
  fn: CommandFn;
};
