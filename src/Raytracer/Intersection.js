export default class Intersection {
  constructor(isHit, position, normal, ray, material) {
    this.isHit = isHit;
    this.position = position;
    this.normal = normal;
    this.material = material;
    this.distance = this.isHit
      ? position.distance(ray.start)
      : Number.MAX_SAFE_INTEGER;
  }
}
