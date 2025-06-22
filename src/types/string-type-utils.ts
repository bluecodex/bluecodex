export type StringToNumber<Token extends string> =
  Token extends `${infer N extends number}` ? N : never;
