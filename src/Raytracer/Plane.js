import Intersection from './Intersection';
import Vector from './Vector';
import Material from './Material';
import Ray from './Ray';

export default class Plane {
  constructor(position: Vector, material: Material) {
    this.position = position;
    this.material = material;
  }

  /**
   * @function {function intersect}
   * @param  {Ray} ray {description}
   * @return {Intersection} {description}
   */
  intersect(ray) {
    const denom = this.position.dotProduct(ray.direction);

    if (denom >= 0) {
      return new Intersection(false);
    }

    const dist = this.position.dotProduct(ray.origin) / denom;

    if (dist < 0) return new Intersection(false);

    const point = ray.at(dist);

    return new Intersection(
      true,
      point,
      this.position.normalize(),
      ray,
      this.material
    );
  }
}
