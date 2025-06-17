export type ExpandObject<T> = { [K in keyof T]: T[K] } & {};
