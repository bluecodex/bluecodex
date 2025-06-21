export type Concat<TOne extends Array<unknown>, TTwo extends Array<unknown>> = [
  ...TOne,
  ...TTwo,
];

export type EmptyArray<T> = T[];
