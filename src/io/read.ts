import * as E from 'fp-ts/Either';
import { readFileSync } from 'fs';

export default function contents(pathname: string) {
  return E.tryCatch(
    () => readFileSync(pathname, "utf8"),
    (error) => (error as Error).message
  );
}
