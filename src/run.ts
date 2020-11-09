import * as E from 'fp-ts/Either';
import input from './input';
import { output } from './movements';
import { pipe } from 'fp-ts/lib/function';

export default function run(x: string) {
  return pipe(
    x,
    input,
    E.map(({ grid, robots }) => {
      return robots.map((robot) =>
        output({
          grid,
          prev: robot.position,
          instructions: robot.instructions,
        })
      );
    })
  );
}
