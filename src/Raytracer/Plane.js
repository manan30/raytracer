import Intersection from './Intersection';
import Vector from './Vector';
import Material from './Material';

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
    const denom = this.position.dotProduct(ray.dir);

    if (denom > 0) {
      return new Intersection(false);
    }

    const dist = this.position.dotProduct(ray.start) / denom;
    const point = ray.at(dist).normalize();

    return new Intersection(
      true,
      point,
      this.position.normalize(),
      ray,
      this.material
    );
  }
}
