import config from 'config';
import input from './input';
import { expectLeft } from './tests/Either';

const maxSingleCoord: number = config.get("maxSingleCoord");
const maxInstructionLength: number = config.get("maxInstructionLength");

describe("Input", () => {
  it.todo("should return Right if it can parse input");

  describe("Format", () => {
    it("should return Left if input is empty", () => {
      const output = input("");
      expectLeft(output).toBe("Input cannot be empty");
    });

    it("should return Left if first block is more than three lines long", () => {
      const output = input(`5 3
1 1 E
RFRFRFRF
RFRFRFRF`);
      expectLeft(output).toBe("Invalid length 3, expected 2");
    });

    it("should return Left if subsequent blocks are more than two lines long", () => {
      const output = input(`5 3
1 1 E
RFRFRFRF

1 1 E
RFRFRFRF
1 1 E`);
      expectLeft(output).toBe("Invalid length 1, expected 3");
    });

    it("should return Left if subsequent blocks only have one line", () => {
      const output = input(`5 3
1 1 E
RFRFRFRF

1 1 E`);
      expectLeft(output).toBe("Invalid length 1, expected 3");
    });
  });

  describe("Grid", () => {
    it("should return Left if any coordinate exceeds maximum", () => {
      const output = input(`${maxSingleCoord + 1} 3
1 1 E
RFRFRFRF`);
      expectLeft(output).toBe(
        `Coordinate exceeds maximum of ${maxSingleCoord}`
      );
    });

    it("should return Left if there are more than two coordinates", () => {
      const output = input(`2 3 4
1 1 E
RFRFRFRF`);
      expectLeft(output).toBe("Invalid length 3, expected 2");
    });

    it("should return Left if there is only one coordinate", () => {
      const output = input(`2
1 1 E
RFRFRFRF`);
      expectLeft(output).toBe("Invalid length 1, expected 2");
    });

    it("should return Left if there are no coordinates", () => {
      const output = input(`
1 1 E
RFRFRFRF`);
      expectLeft(output).toBe("Invalid length 1, expected 2");
    });
  });

  describe("Initial position", () => {
    it("should return Left if there are more than two coordinates", () => {
      const output = input(`5 3
1 1 1 E
RFRFRFRF`);
      expectLeft(output).toBe("Invalid length 1, expected 3");
    });

    it("should return Left if there is only one coordinate", () => {
      const output = input(`5 3
1 E
RFRFRFRF`);
      expectLeft(output).toBe("Invalid length 1, expected 3");
    });

    it("should return Left if there are no coordinates", () => {
      const output = input(`5 3
E
RFRFRFRF`);
      expectLeft(output).toBe("Invalid length 1, expected 3");
    });

    it("should return Left if orientation is missing", () => {
      const output = input(`5 3
1 1
RFRFRFRF`);
      expectLeft(output).toBe("Invalid length 1, expected 3");
    });

    it("should return Left if orientation is not valid", () => {
      const output = input(`5 3
1 1 K
RFRFRFRF`);
      expectLeft(output).toBe("Invalid length 1, expected 3");
    });
  });

  describe("Instructions", () => {
    it("should return Left if instructions include any invalid input", () => {
      const output = input(`5 3
1 1 E
RFRFRFZF`);
      expectLeft(output).toBe("Invalid instruction 'Z'");
    });

    it.only("should return Left if instructions exceed the maximum", () => {
      const output = input(`5 3
1 1 E
${Array(maxInstructionLength + 1)
  .fill("R")
  .join("")}`);
      expectLeft(output).toBe("Invalid length 101, expected 100");
    });
  });
});
