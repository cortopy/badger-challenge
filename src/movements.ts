import {
  INSTRUCTION,
  MarsGrid,
  ORIENTATION,
  Output,
  RobotPosition,
} from "./types";

function rotate(
  orientation: ORIENTATION,
  direction: INSTRUCTION.LEFT | INSTRUCTION.RIGHT
) {
  if (direction === INSTRUCTION.LEFT) {
    return orientation < ORIENTATION.NORTH ? orientation - 1 : ORIENTATION.WEST;
  }
  return orientation < ORIENTATION.WEST ? orientation + 1 : ORIENTATION.NORTH;
}

function moveForward([coordinates, orientation]: RobotPosition): RobotPosition {
  const [x, y] = coordinates;
  switch (orientation) {
    case ORIENTATION.NORTH:
      return [[x, y + 1], orientation];
    case ORIENTATION.EAST:
      return [[x + 1, y], orientation];
    case ORIENTATION.SOUTH:
      return [[x, y - 1], orientation];
    case ORIENTATION.WEST:
      return [[x - 1, y], orientation];
  }
}

type NextPosition = {
  position: RobotPosition;
  hasFallen: boolean;
};

type NextPositionOpts = {
  grid: MarsGrid;
  prev: RobotPosition;
  instruction: INSTRUCTION;
};

function nextPosition({
  grid,
  prev,
  instruction,
}: NextPositionOpts): NextPosition {
  const [coordinates, orientation] = prev;
  switch (instruction) {
    case INSTRUCTION.LEFT:
      return {
        position: [coordinates, rotate(orientation, INSTRUCTION.LEFT)],
        hasFallen: false,
      };
    case INSTRUCTION.RIGHT:
      return {
        position: [coordinates, rotate(orientation, INSTRUCTION.RIGHT)],
        hasFallen: false,
      };
    case INSTRUCTION.FORWARD:
      const position = moveForward(prev);
      const [x, y] = coordinates;
      const [bottomLeft, topRight] = grid;
      return {
        position,
        hasFallen:
          x < bottomLeft[0] ||
          y < bottomLeft[0] ||
          x > topRight[0] ||
          x > topRight[1],
      };
  }
}

type OutputOpts = {
  grid: MarsGrid;
  prev: RobotPosition;
  instructions: INSTRUCTION[];
};
export function output(input: OutputOpts): Output {
  const { grid, prev, instructions } = input;

  if (!instructions.length) {
    return {
      position: prev,
      hasFallen: false,
    };
  }

  const [nextInstruction, ...remainingInstructions] = instructions;

  const { position, hasFallen } = nextPosition({
    grid,
    prev,
    instruction: nextInstruction,
  });

  if (hasFallen) {
    return {
      position: prev,
      hasFallen: true,
    };
  }

  return output({
    grid,
    prev: position,
    instructions: remainingInstructions,
  });
}
