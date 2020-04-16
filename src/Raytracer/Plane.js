import Intersection from './Intersection';

export default class Plane {
  constructor(name, position, color, material) {
    this.name = name;
    this.position = position;
    this.color = color;
    this.material = material;
  }

  normal() {
    return this.position;
  }

  intersect(ray) {
    const denom = this.position.dotProduct(ray.dir);

    if (denom > 0) {
      return new Intersection(false);
    }

    const dist = this.position.dotProduct(ray.start).scalarDivide(-denom);
    const position = ray.at(dist);

    return new Intersection(true, position, this.position, ray, this.material);
  }
}
