export const numericTransformer = {
  to: (value: number) => value,
  from: (value: string | number | null) =>
    value === null || value === undefined ? 0 : Number(value),
};

export const dateTransformer = {
  to: (value: string) => value,
  from: (value: Date | string) =>
    typeof value === 'string'
      ? value.slice(0, 10)
      : value.toISOString().slice(0, 10),
};
