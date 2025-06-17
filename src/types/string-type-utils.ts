export type BeforeChar<
  Char extends string,
  S extends string,
> = S extends `${infer Before}${Char}${string}` ? Before : S;

export type AfterChar<
  Char extends string,
  S extends string,
  Fallback = never,
> = S extends `${string}${Char}${infer After}` ? After : Fallback;

export type StringToNumber<S extends string> =
  S extends `${infer N extends number}` ? N : never;
