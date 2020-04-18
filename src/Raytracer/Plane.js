import Intersection from './Intersection';

export default class Plane {
  constructor(position, material) {
    this.position = position;
    this.material = material;
  }

  intersect(ray) {
    const denom = this.position.dotProduct(ray.dir);

    if (denom > 0) {
      return new Intersection(false);
    }

    const dist = this.position.dotProduct(ray.start) / denom;
    const position = ray.at(dist);

    return new Intersection(true, position, this.position, ray, this.material);
  }
}
