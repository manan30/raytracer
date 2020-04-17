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
    const rayToCenter = ray.start.subtract(this.position);
    const b = 2 * ray.dir.dotProduct(rayToCenter);
    const a = ray.dir.dotProduct(ray.dir);
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

    const position = ray.at(closestDistance);
    const normal = position.subtract(this.position).scalarDivide(this.size);

    return new Intersection(true, position, normal, ray, this.material);
  }
}
