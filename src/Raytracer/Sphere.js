import Vector from './Vector';
import Intersection from './Intersection';

export default class Sphere {
  constructor(name, position, size, color) {
    this.position = position;
    this.size = size;
    this.color = color;
  }

  normal(pos) {
    return Vector.normalize(Vector.subtract(pos, this.position));
  }

  intersect(ray) {
    const eyeToCenter = Vector.subtract(this.position, ray.start);
    const v = Vector.dotProduct(eyeToCenter, ray.dir);
    let dist = 0;

    if (v >= 0) {
      const eoDot = Vector.dotProduct(eyeToCenter, eyeToCenter);
      const discriminant = this.size * this.size - (eoDot - v * v);
      if (discriminant >= 0) {
        dist = v - Math.sqrt(discriminant);
      }
    }

    if (dist === 0) {
      return null;
    }
    return new Intersection(this, ray, dist);
  }
}
