import Vector from './Vector';

export default class Ray {
  constructor(origin: Vector, direction: Vector) {
    this.origin = origin;
    this.direction = direction;
  }

  /**
   * @function {function at}
   * @param  {Number} factor {description}
   * @return {Vector} {description}
   */
  at(factor) {
    return this.origin.add(this.direction.scalarMultiply(factor));
  }
}
