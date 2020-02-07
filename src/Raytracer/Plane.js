import Vector from './Vector';

export default class Plane {
  constructor(name, position, color) {
    this.name = name;
    this.position = position;
    this.color = color;
  }

  intersect(ray) {
    const denom = Vector.dotProduct(this.position, ray.vector);
    if (denom > 0) {
      return null;
    }
    const dist = (Vector.dotProduct(this.position, ray.point) + 0.0) / -denom;
    return dist;
  }
}
