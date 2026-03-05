export function parseReferenceString(rawInput) {
  const values = rawInput
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((value) => Number(value));

  const isValid = values.length > 0 && values.every((value) => Number.isInteger(value) && value >= 0);
  return isValid ? values : null;
}
