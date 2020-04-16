import Intersection from './Intersection';

export default class Sphere {
  constructor(name, position, size, color, material) {
    this.name = name;
    this.position = position;
    this.size = size;
    this.color = color;
    this.material = material;
  }

  intersect(ray) {
    const b = 2 * ray.dir.dotProduct(ray.start.subtract(this.position));
    const rayToCenter = ray.start.subtract(this.position);
    const c = rayToCenter.dotProduct(rayToCenter) - this.size * this.size;
    const discriminant = b * b - 4 * c;

    if (discriminant <= 0) return new Intersection(false);

    let closestDistance = 0;
    const distance1 = (-1 * b + Math.sqrt(discriminant)) / 2;
    const distance2 = (-1 * b - Math.sqrt(discriminant)) / 2;

    if (distance1 < 0 && distance2 < 0) return new Intersection(false);
    if (distance2 < 0) closestDistance = distance1;
    else closestDistance = Math.min(distance1, distance2);

    const position = ray.at(closestDistance);
    const normal = position.subtract(this.position).scalarDivide(this.size);

    return new Intersection(true, position, normal, ray, this.material);
  }
}
