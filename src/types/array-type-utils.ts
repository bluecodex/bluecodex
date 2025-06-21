export type Concat<
  TOne extends Array<unknown>,
  TTwo extends Array<unknown>,
> = TOne extends never[]
  ? TTwo
  : TTwo extends never[]
    ? TOne
    : [...TOne, ...TTwo];

export type EmptyArray<T> = T[] & never[];
