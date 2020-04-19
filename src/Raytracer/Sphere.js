import Intersection from './Intersection';
import Vector from './Vector';
import Material from './Material';

export default class Sphere {
  constructor(position: Vector, size: Number, material: Material) {
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
    const rayToCenter = ray.start.subtract(this.position);
    const b = 2 * ray.dir.dotProduct(rayToCenter);
    const a = ray.dir.dotProduct(ray.dir);
    const c = rayToCenter.dotProduct(rayToCenter) - this.size * this.size;
    let discriminant = b * b - 4 * a * c;

    if (discriminant < 0) return new Intersection(false);

    discriminant = Math.sqrt(discriminant);

    let closestDistance = 0;
    let distance1 = 0.0;
    let distance2 = 0.0;

    if (discriminant === 0) {
      distance1 = (-0.5 * b) / a;
    } else {
      const q = b > 0 ? 0.5 * (-b + discriminant) : 0.5 * (-b - discriminant);
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

    const point = ray.at(closestDistance).normalize();

    // Normal needs to be flipped if this is a refractive ray.
    // if (ray.direction.dot(normal) > 0) {
    //   normal *= -1;
    // }

    const normal = point.subtract(this.position).normalize();

    return new Intersection(true, point, normal, ray, this.material);
  }
}
