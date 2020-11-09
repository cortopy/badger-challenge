import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as NEA from 'fp-ts/NonEmptyArray';
import config from 'config';
import { is, isNil } from 'rambda';
import { pipe } from 'fp-ts/lib/function';
import { sequenceS, sequenceT } from 'fp-ts/lib/Apply';
import {
  ORIENTATION,
  INSTRUCTION,
  GridCoordinates,
  RobotPosition,
  MarsGrid,
  RobotBlock,
  Input,
} from "./types";

const maxInstructionLength: number = config.get("maxInstructionLength");
const maxSingleCoord: number = config.get("maxSingleCoord");
const sequenceSE = sequenceS(E.either);
const sequenceTE = sequenceT(E.either);

const splitLines = (x: string) => x.split(/\r?\n/);
const splitByWhitespace = (x: string) => x.trim().split(" ");

const hasLength = (n: number) => <T>(x: Array<T>) =>
  x.length == n
    ? E.right(x)
    : E.left(`Invalid length ${x.length}, expected ${n}`);
const hasLengthLessThan = (n: number) => <T>(x: Array<T>) =>
  x.length <= n
    ? E.right(x)
    : E.left(`Invalid length ${x.length}, expected ${n}`);
const hasLength2 = hasLength(2);
const hasLength3 = hasLength(3);

const isAllNumber = <T>(x: Array<T>) =>
  x.every(is(Number)) ? E.right(x) : E.left("Invalid coordinate value");

const hasValuesLessThan = (n: number) => (x: Array<number>) =>
  x.every((x) => x <= n)
    ? E.right(x)
    : E.left(`Coordinate exceeds maximum of ${maxSingleCoord}`);

function coordinates(x: string) {
  const coords = splitByWhitespace(x)
    .map(Number)
    .filter((x) => !isNil(x)) as [number, number];
  return pipe(
    hasLength2(coords),
    E.chain(isAllNumber),
    E.chain(hasValuesLessThan(maxSingleCoord))
  ) as E.Either<string, GridCoordinates>;
}

function orientationOf(x: string): E.Either<string, ORIENTATION> {
  switch (x) {
    case "N":
      return E.right(ORIENTATION.NORTH);
    case "S":
      return E.right(ORIENTATION.SOUTH);
    case "E":
      return E.right(ORIENTATION.EAST);
    case "W":
      return E.right(ORIENTATION.WEST);
    default:
      return E.left("Invalid orientation");
  }
}

function robotPosition(x: string) {
  return pipe(
    hasLength3(splitByWhitespace(x)),
    E.chain(
      (x) =>
        sequenceTE(
          coordinates([x[0], x[1]].join(" ")),
          orientationOf(x[2])
        ) as E.Either<string, RobotPosition>
    )
  );
}

function grid(x: string) {
  return pipe(
    x,
    coordinates,
    E.map((coords) => [[0, 0], coords] as MarsGrid)
  );
}

function instructionOf(x: string) {
  switch (x) {
    case "L":
      return E.right(INSTRUCTION.LEFT);
    case "R":
      return E.right(INSTRUCTION.RIGHT);
    case "F":
      return E.right(INSTRUCTION.FORWARD);
    default:
      return E.left(`Invalid instruction '${x}'`);
  }
}

function robotBlock(x: string[]) {
  return pipe(
    hasLength2(x),
    E.chain(
      (x) =>
        sequenceSE({
          position: robotPosition(x[0]),
          instructions: pipe(
            x[1].trim().split(""),
            A.traverse(E.either)(instructionOf),
            E.chain(hasLengthLessThan(maxInstructionLength))
          ),
        }) as E.Either<string, RobotBlock>
    )
  );
}

function castInput([firstBlock, ...rest]: NEA.NonEmptyArray<string>): E.Either<
  string,
  Input
> {
  const [initialGrid, ...firstRobot] = splitLines(firstBlock);
  const robots = [firstRobot, ...rest] as string[][];

  return sequenceSE({
    grid: grid(initialGrid),
    robots: A.traverse(E.either)(robotBlock)(robots),
  }) as E.Either<string, Input>;
}

export default function input(x: string) {
  return pipe(
    x
      .split(/[\r\r]?\n\n/) // split blocks
      .filter(Boolean),
    NEA.fromArray,
    E.fromOption(() => "Input cannot be empty"),
    E.chain(castInput)
  );
}
