import Intersection from './Intersection';
import Vector from './Vector';
import Material from './Material';
import Ray from './Ray';

export default class Plane {
  constructor(normal: Vector, material: Material) {
    this.normal = normal;
    this.material = material;
  }

  /**
   * @function {function intersect}
   * @param  {Ray} ray {description}
   * @return {Intersection} {description}
   */
  intersect(ray) {
    const denom = this.normal.dotProduct(ray.direction);

    if (denom >= 0) {
      return new Intersection(false);
    }

    const dist = -(this.normal.dotProduct(ray.origin) / denom);

    const intersectionPoint = ray.at(dist);

    return new Intersection(
      true,
      intersectionPoint,
      this.normal.normalize(),
      ray,
      this.material
    );
  }
}
