import Vector from './Vector';

export default class Sphere {
  constructor(name, position, size, color) {
    this.position = position;
    this.size = size;
    this.color = color;
  }

  intersect(ray) {
    const eyeToCenter = Vector.subtract(this.position, ray.point);
    const v = Vector.dotProduct(eyeToCenter, ray.vector);
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
    return dist;
  }
}
