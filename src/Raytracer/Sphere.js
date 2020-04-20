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
    const a = ray.dir.dotProduct(ray.dir);
    const b = 2 * ray.dir.dotProduct(rayToCenter);
    const c = rayToCenter.dotProduct(rayToCenter) - this.size * this.size;
    const discriminant = b * b - 4 * a * c;

    let closestDistance = 0;
    let distance1;
    let distance2;

    if (discriminant < 0) return new Intersection(false);

    if (discriminant === 0) {
      distance1 = -b / (2 * a);
    } else {
      distance1 = (-b - discriminant) / (2 * a);
      distance2 = (-b + discriminant) / (2 * a);
    }

    closestDistance = distance1 > 0 ? distance1 : distance2;

    if (closestDistance > 0) {
      const intersectionPoint = ray.at(closestDistance);
      const normal = intersectionPoint.subtract(this.position).normalize();

      return new Intersection(
        true,
        intersectionPoint,
        normal,
        ray,
        this.material
      );
    }

    return new Intersection(null);
  }
}
