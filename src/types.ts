export enum ORIENTATION {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export enum INSTRUCTION {
  LEFT,
  RIGHT,
  FORWARD,
}

export type GridCoordinates = [number, number];
export type MarsGrid = [[0, 0], GridCoordinates];
export type InstructionList = Array<INSTRUCTION>;

export type RobotPosition = [GridCoordinates, ORIENTATION];

export interface RobotBlock {
  position: RobotPosition;
  instructions: InstructionList;
}

export interface Input {
  grid: MarsGrid;
  robots: RobotBlock[];
}

export interface Output {
  position: RobotPosition;
  hasFallen: boolean;
}
