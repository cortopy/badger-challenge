import contents from './read';
import { expectLeft } from '../tests/Either';

describe("Read file", () => {
  it("should return Left if file does not exist", () => {
    const output = contents("non-existent.txt");
    expectLeft(output).toBe(
      "ENOENT: no such file or directory, open 'non-existent.txt'"
    );
  });
});
