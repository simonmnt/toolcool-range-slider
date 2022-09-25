// step is defined in absolute units, not percent
export type TStep = ((value: number | string, percent: number) => number) | number | undefined | null;
export type TData = (string | number)[] | undefined;
