import Vector from './Vector';

export default class Plane {
  constructor(name, position) {
    this.name = name;
    this.position = position;
  }

  intersect(ray) {
    const denom = Vector.dotProduct(this.position, ray.vector);
    if (denom > 0) {
      return undefined;
    }
    const dist = (Vector.dotProduct(this.position, ray.point) + 0.0) / -denom;
    return dist;
  }
}
