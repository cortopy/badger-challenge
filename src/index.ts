import * as E from 'fp-ts/Either';
import contents from './io/read';
import run from './run';
import { ORIENTATION, Output } from './types';
import { pipe } from 'fp-ts/lib/function';

function orientationToString(x: ORIENTATION) {
  switch (x) {
    case ORIENTATION.NORTH:
      return "N";
    case ORIENTATION.SOUTH:
      return "S";
    case ORIENTATION.EAST:
      return "E";
    case ORIENTATION.WEST:
      return "W";
  }
}

function main() {
  E.fold(console.error, (results: Output[]) => {
    results.forEach(({ position, hasFallen }) => {
      const [[x, y], orientation] = position;
      console.log(
        `${x} ${y} ${orientationToString(orientation)}${
          hasFallen ? " LOST" : ""
        }`
      );
    });
  })(pipe(contents(process.argv[2]), E.chain(run)));
}

main();
