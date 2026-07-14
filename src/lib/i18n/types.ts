export type Dict = { [key: string]: string | Dict };

export function getNested(dict: Dict, key: string): string | undefined {
  const parts = key.split(".");
  let cur: string | Dict | undefined = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) {
      cur = (cur as Dict)[p];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}
