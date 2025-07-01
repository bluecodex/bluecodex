export type StringToNumber<
  Token extends string,
  Fallback,
> = Token extends `${infer N extends number}` ? N : Fallback;
