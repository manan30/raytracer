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

    let closestDistance = 0;
    let distance1;
    let distance2;

    if (discriminant < 0) return new Intersection(false);

    if (discriminant === 0) {
      distance1 = (-0.5 * b) / a;
    } else {
      const q =
        b > 0
          ? -0.5 * (b + Math.sqrt(discriminant))
          : -0.5 * (b - Math.sqrt(discriminant));
      distance1 = q / a;
      distance2 = c / q;
    }

    if (distance1 > distance2) {
      const temp = distance1;
      distance1 = distance2;
      distance2 = temp;
    }

    if (distance1 < 0) {
      distance1 = distance2;
      if (distance1 < 0) return new Intersection(false);
    }

    closestDistance = distance1;

    const intersectionPoint = ray.at(closestDistance);
    const normal = intersectionPoint
      .subtract(this.position)
      .scalarDivide(this.size);

    return new Intersection(
      true,
      intersectionPoint,
      normal,
      ray,
      this.material
    );
  }
}
