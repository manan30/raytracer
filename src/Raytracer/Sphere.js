import Intersection from './Intersection';
import Ray from './Ray';
import Vector from './Vector';
import Color from './Color';

export default class Sphere {
  constructor(position: Vector, size: Number, material: Color) {
    this.position = position;
    this.size = size;
    this.material = material;
  }

  /**
   * @function {function intersect}
   * @param  {Ray} ray {description}
   * @return {Intersection} {description}
   */
  intersect(ray) {
    const rayToCenter = ray.origin.subtract(this.position);
    const a = ray.direction.dotProduct(ray.direction);
    const b = 2 * ray.direction.dotProduct(rayToCenter);
    const c = rayToCenter.dotProduct(rayToCenter) - this.size * this.size;
    const discriminant = b * b - 4 * a * c;

    let closestDistance = 0.0;
    let distance1 = 0.0;
    let distance2 = 0.0;

    if (discriminant < 0) return new Intersection(false);

    if (discriminant === 0) {
      distance1 = -b / (2 * a);
    } else {
      distance1 = (-b - discriminant) / (2 * a);
      distance2 = (-b + discriminant) / (2 * a);
    }

    closestDistance = distance1 > 0 ? distance1 : distance2;

    if (closestDistance > 0) {
      const intersectionPoint = ray.at(closestDistance);
      const normal = intersectionPoint.subtract(this.position).normalize();

      return new Intersection(
        true,
        intersectionPoint,
        normal,
        ray,
        this.material
      );
    }

    return new Intersection(false);
  }
}
