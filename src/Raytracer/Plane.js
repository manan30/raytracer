import Vector from './Vector';
import Intersection from './Intersection';

export default class Plane {
  constructor(name, position, color, surface) {
    this.name = name;
    this.position = position;
    this.color = color;
    this.surface = surface;
  }

  normal() {
    return this.position;
  }

  intersect(ray) {
    const denom = Vector.dotProduct(this.position, ray.dir);
    if (denom > 0) {
      return null;
    }
    const dist = (Vector.dotProduct(this.position, ray.start) + 0.0) / -denom;
    return new Intersection(this, ray, dist);
  }
}
