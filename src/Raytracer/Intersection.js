import Vector from './Vector';
import Ray from './Ray';
import Material from './Material';

export default class Intersection {
  constructor(
    isHit: Boolean,
    point: Vector,
    normal: Vector,
    ray: Ray,
    material: Material
  ) {
    this.isHit = isHit;
    this.point = point;
    this.normal = normal;
    this.ray = ray;
    this.material = material;
    this.distance = this.isHit
      ? point.distance(ray.start)
      : Number.MAX_SAFE_INTEGER;
  }
}
