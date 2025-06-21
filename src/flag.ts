import chalk from "chalk";

import {
  type CastData,
  type DataType,
  type DataTypeByName,
  type ValidDataType,
  castData,
  isValidDataType,
} from "./data-type";

/*
 * Types
 */

export type Flag<
  Name extends string = string,
  Short extends string | true | null = string | true | null,
  Required extends boolean = boolean,
  Type extends DataType = DataType,
  ExplicitType extends boolean = boolean,
  Fallback extends any | null = any | null,
> = {
  name: Name;
  short: Short;
  required: Required;
  type: Type;
  explicitType: ExplicitType;
  fallback: Fallback;
};

export type IsNullableFlag<F extends Flag> = F["required"] extends false
  ? F["fallback"] extends null
    ? true
    : false
  : false;

type SingleDashFlagFromMaybe<
  MaybeRequiredName extends string,
  MaybeValidType extends string,
  ExplicitType extends boolean,
  MaybeFallback extends string | null,
  // --
  Type extends DataType = ValidDataType<MaybeValidType, "boolean">,
  Fallback extends any | null = CastData<Type, MaybeFallback>,
> = MaybeRequiredName extends `${infer RequiredName}!`
  ? Flag<RequiredName[0], true, true, Type, ExplicitType, Fallback>
  : Flag<
      MaybeRequiredName[0],
      true,
      false,
      ValidDataType<MaybeValidType, "boolean">,
      ExplicitType,
      Fallback
    >;

type ShortFromMaybe<S extends string> = S extends `-${infer Short}${string})`
  ? Short
  : null;

type DoubleDashFlagFromMaybes<
  MaybeShortRequiredName extends string,
  MaybeValidType extends string,
  ExplicitType extends boolean,
  MaybeFallback extends string | null,
  // --
  Type extends DataType = ValidDataType<MaybeValidType, "boolean">,
  Fallback extends any | null = CastData<Type, MaybeFallback>,
> = MaybeShortRequiredName extends `${infer RequiredMaybeShortName}!`
  ? RequiredMaybeShortName extends `${infer RequiredName}(${infer MaybeShort}`
    ? Flag<
        RequiredName,
        ShortFromMaybe<MaybeShort>,
        true,
        Type,
        ExplicitType,
        Fallback
      >
    : Flag<RequiredMaybeShortName, null, true, Type, ExplicitType, Fallback>
  : MaybeShortRequiredName extends `${infer RequiredName}(${infer MaybeShort}`
    ? Flag<
        RequiredName,
        ShortFromMaybe<MaybeShort>,
        false,
        Type,
        ExplicitType,
        Fallback
      >
    : Flag<MaybeShortRequiredName, null, false, Type, ExplicitType, Fallback>;

export type FlagFromInput<S extends string> =
  S extends `--${infer DoubleDashBody}`
    ? DoubleDashBody extends `${infer MaybeRequiredName}:${infer MaybeValidType}=${infer Fallback}`
      ? DoubleDashFlagFromMaybes<
          MaybeRequiredName,
          MaybeValidType,
          true,
          Fallback
        >
      : DoubleDashBody extends `${infer MaybeRequiredName}:${infer MaybeValidType}`
        ? DoubleDashFlagFromMaybes<
            MaybeRequiredName,
            MaybeValidType,
            true,
            null
          >
        : DoubleDashBody extends `${infer MaybeRequiredName}=${infer Fallback}`
          ? DoubleDashFlagFromMaybes<
              MaybeRequiredName,
              "boolean",
              false,
              Fallback
            >
          : DoubleDashFlagFromMaybes<DoubleDashBody, "boolean", false, null>
    : S extends `-${infer SingleDashBody}`
      ? SingleDashBody extends `${infer MaybeRequiredName}:${infer MaybeValidType}=${infer MaybeFallback}`
        ? SingleDashFlagFromMaybe<
            MaybeRequiredName,
            MaybeValidType,
            true,
            MaybeFallback
          >
        : SingleDashBody extends `${infer MaybeRequiredName}:${infer MaybeValidType}`
          ? SingleDashFlagFromMaybe<
              MaybeRequiredName,
              MaybeValidType,
              true,
              null
            >
          : SingleDashBody extends `${infer MaybeRequiredName}=${infer MaybeFallback}`
            ? SingleDashFlagFromMaybe<
                MaybeRequiredName,
                "boolean",
                false,
                MaybeFallback
              >
            : SingleDashFlagFromMaybe<SingleDashBody, "boolean", false, null>
      : Flag;

/*
 * Functions
 */

export function extractFlagShortFromNameInput(nameInput: string) {
  const index = nameInput.indexOf("(");
  if (index === -1) return { name: nameInput, short: null };

  const name = nameInput.slice(0, index);
  const rawShort = nameInput.slice(index);
  const short = rawShort[2];

  const isValidShortLetter = /^[a-zA-Z]$/.test(short);
  const isValidShort =
    rawShort.startsWith("(-") && rawShort.endsWith(")") && isValidShortLetter;

  return { name, short: isValidShort ? short : null };
}

export function parseFlag<S extends string>(input: S): FlagFromInput<S> {
  const dashCount = input[1] === "-" ? 2 : 1;

  const parts = input.slice(dashCount).split(/[:=]/);
  const explicitType = input.includes(":");

  const rawName = parts.shift()!;
  const maybeValidType = explicitType ? parts.shift() : undefined;
  const rawFallback = input.includes("=") ? parts.shift() : undefined;

  const required = rawName.endsWith("!");
  const maybeNameWithoutHashbang = required ? rawName.slice(0, -1) : rawName;
  const { name, short } =
    dashCount === 1
      ? { name: maybeNameWithoutHashbang[0], short: true }
      : extractFlagShortFromNameInput(maybeNameWithoutHashbang);

  const type: DataType =
    maybeValidType && isValidDataType(maybeValidType)
      ? maybeValidType
      : "boolean";

  const fallback =
    typeof rawFallback === "undefined"
      ? null
      : castData({ type, input: rawFallback });

  return {
    name,
    short,
    type,
    explicitType,
    required,
    fallback,
  } satisfies Flag<any, any, any, any, any> as FlagFromInput<S>;
}

export function castFlag<F extends Flag>({
  flag,
  input,
}: {
  flag: F;
  input: string;
}): DataTypeByName<F["type"]> {
  if (flag.required && !input) {
    throw new Error(
      `Flag ${chalk.bold(`${flag.name}:${flag.type}`)} is required and was not provided.`,
    );
  }

  try {
    return castData({ type: flag.type, input }) as DataTypeByName<F["type"]>;
  } catch {
    throw new Error(
      `Invalid value ${chalk.redBright(input)} for flag ${chalk.bold(`${flag.name}:${flag.type}`)}`,
    );
  }
}

export function formatFlag(flag: Flag) {
  const parts: string[] = [];

  parts.push(chalk(`${flag.short === true ? "-" : "--"}${flag.name}`));
  if (typeof flag.short === "string") parts.push(chalk.dim(`(-${flag.short})`));
  if (flag.explicitType) parts.push(chalk.dim(`:${flag.type}`));
  if (flag.fallback !== null) parts.push(chalk.dim(`=${flag.fallback}`));

  return parts.join("");
}
