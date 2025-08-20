import type { MaybeReadonly } from "../types/maybe-readonly";
import type { DataTypeToken } from "./data-type-token";

export type DataTypeSchema<DT extends DataTypeToken = DataTypeToken> =
  DT extends "string"
    ? {
        initial?: string;
        validate?:
          | MaybeReadonly<
              Array<string | { value: string; description?: string }>
            >
          | ((value: string) => boolean | string);
        message?: string;
      }
    : DT extends "boolean"
      ? { initial?: boolean; message?: string }
      : DT extends "number"
        ? {
            initial?: number;
            validate?: (value: number) => boolean | string;
            min?: number;
            max?: number;
            float?: boolean | { decimalPlaces: number };
            step?: number;
            message?: string;
          }
        : {};
