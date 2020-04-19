import Vector from './Vector';

export default class Ray {
  constructor(start: Vector, dir: Vector) {
    this.start = start;
    this.dir = dir;
  }

  /**
   * @function {function at}
   * @param  {Number} factor {description}
   * @return {Vector} {description}
   */
  at(factor) {
    return this.start.add(this.dir.scalarMultiply(factor));
  }
}
