import path from 'path';
import run from './run';
import { expectRight } from './tests/Either';
import { ORIENTATION } from './types';

describe("Runner", () => {
  it("should output expected values for case 1", () => {
    const output = run(`5 3
1 1 E
RFRFRFRF`);
    expectRight(output).toStrictEqual([
      {
        hasFallen: false,
        position: [[1, 1], ORIENTATION.EAST],
      },
    ]);
  });

  it("should output expected values for case 2", () => {
    const output = run(`5 3
3 2 N
F`);
    expectRight(output).toStrictEqual([
      {
        hasFallen: true,
        position: [[3, 3], ORIENTATION.NORTH],
      },
    ]);
  });

  it("should output expected values for case 3", () => {
    const output = run(`5 3
0 3 W
LLFFFLFLFL`);
    expectRight(output).toStrictEqual([
      {
        hasFallen: false,
        position: [[2, 3], ORIENTATION.SOUTH],
      },
    ]);
  });
});
