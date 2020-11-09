export enum ORIENTATION {
  NORTH,
  SOUTH,
  EAST,
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

export interface RobotInitialPosition {
  coordinates: GridCoordinates;
  orientation: ORIENTATION;
}

export interface RobotBlock {
  position: RobotInitialPosition;
  instructions: InstructionList;
}

export interface Input {
  grid: MarsGrid;
  robots: RobotBlock[];
}
