type Row = { id?: number };

export function fakeRepo<T extends Row>(seed: T[] = []) {
  const rows = seed.map((row) => ({ ...row }));
  let nextId = rows.reduce((max, row) => Math.max(max, row.id ?? 0), 0) + 1;

  function matches(row: T, where: Partial<T>) {
    return Object.entries(where).every(
      ([key, value]) => row[key as keyof T] === value,
    );
  }

  return {
    rows,
    find: jest.fn(async (opts?: { where?: Partial<T> }) => {
      if (!opts?.where) {
        return [...rows];
      }
      return rows.filter((row) => matches(row, opts.where as Partial<T>));
    }),
    findOneBy: jest.fn(async (where: Partial<T>) => {
      return rows.find((row) => matches(row, where)) ?? null;
    }),
    create: jest.fn((dto: Partial<T>) => ({ ...dto }) as T),
    save: jest.fn(async (entity: T) => {
      if (!entity.id) {
        entity.id = nextId++;
        rows.push(entity);
        return entity;
      }

      const index = rows.findIndex((row) => row.id === entity.id);
      if (index >= 0) {
        rows[index] = entity;
      } else {
        rows.push(entity);
      }
      return entity;
    }),
    remove: jest.fn(async (entity: T) => {
      const index = rows.findIndex((row) => row.id === entity.id);
      if (index >= 0) {
        rows.splice(index, 1);
      }
      return entity;
    }),
  };
}
