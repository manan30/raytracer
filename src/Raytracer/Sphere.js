import Vector from './Vector';
import Intersection from './Intersection';

export default class Sphere {
  constructor(name, position, size, color, material) {
    this.name = name;
    this.position = position;
    this.size = size;
    this.color = color;
    this.material = material;
  }

  normal(pos) {
    return Vector.normalize(Vector.subtract(pos, this.position));
  }

  intersect(ray) {
    const b = 2 * ray.direction.dot(ray.origin.subtract(this.center));
    const rayToCenter = ray.origin.subtract(this.center);
    const c = rayToCenter.dot(rayToCenter) - this.radius * this.radius;
    const discriminant = b * b - 4 * c;

    if (discriminant <= 0) return new Intersection(false);

    let closestDistance = 0;
    const distance1 = (-1 * b + Math.sqrt(discriminant)) / 2;
    const distance2 = (-1 * b - Math.sqrt(discriminant)) / 2;

    if (distance1 < 0 && distance2 < 0) return new Intersection(false);
    if (distance2 < 0) closestDistance = distance1;
    else closestDistance = Math.min(distance1, distance2);

    const position = ray.at(closestDistance);
    const normal = position.subtract(this.center).scalarDivide(this.radius);

    return new Intersection(true, position, normal, ray, this.material);
  }
}
