export function mapDto2Where<D = object>(
  dto: D,
  where: unknown,
  keys: Array<keyof D>,
) {
  keys.forEach((key) => {
    if (dto[key]) {
      where[key] = dto[key];
    }
  });
}
