import Vector from './Vector';

export default class Sphere {
  constructor(name, position, size) {
    this.position = position;
    this.size = size;
  }

  intersect(ray) {
    const eyeToCenter = Vector.subtract(this.position, ray.point);
    const v = Vector.dotProduct(eyeToCenter, ray.vector);

    if (v >= 0) {
      const eoDot = Vector.dotProduct(eyeToCenter, eyeToCenter);
      const discriminant = this.size * this.size - (eoDot - v * v);
      if (discriminant >= 0) {
        return v - Math.sqrt(discriminant);
      }
    }

    return undefined;
  }
}
