export default class Ray {
  constructor(start, dir) {
    this.start = start;
    this.dir = dir;
  }

  at(factor) {
    return this.start.add(this.dir.scalarMultiply(factor));
  }
}
