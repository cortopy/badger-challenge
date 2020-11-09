import { Either, fold } from 'fp-ts/Either';
import { identity } from 'fp-ts/function';

export function expectLeft(x: Either<any, any>) {
  return expect(
    fold(identity, (r) => {
      console.error("Received right: ", r);
      throw Error("Right when Left expected");
    })(x)
  );
}

export function expectRight(x: Either<any, any>) {
  return expect(
    fold((r) => {
      console.error("Received left: ", r);
      throw Error("Left when Right expected");
    }, identity)(x)
  );
}
