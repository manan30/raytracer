import Color from './Color';
import Ray from './Ray';
import Scene from './Scene';

/**
 * @class RayTracer
 */

export default class RayTracer {
  constructor(height, width, context) {
    this.scene = new Scene();
    this.height = height;
    this.width = width;
    this.context = context;
    this.inside = true;
  }

  // eslint-disable-next-line class-methods-use-this
  calculateLocalIllumination(position, normal, material) {
    let i = 0.0;
    let x;

    this.scene.lights.forEach((light) => {
      if (light.type === 'ambient') i += light.intensity;
      else {
        if (light.type === 'point') {
          x = light.position.subtract(position);
        } else {
          x = light.position;
        }
        const dot = normal.dotProduct(x);
        if (dot > 0)
          i += ((dot * light.intensity) / normal.length()) * x.length();
      }
    });

    return material.surfaceColor.scalarMultiply(i);
  }

  illuminate(direction, material, position, normal, depth) {
    return this.calculateLocalIllumination(position, normal, material);
  }

  intersectScene(ray) {
    let closest = +Infinity;
    let closestIntersection = null;
    for (let i = 0; i < this.scene.objects.length; i += 1) {
      const object = this.scene.objects[i];

      const intersection = object.intersect(ray);

      if (intersection.isHit && intersection.distance < closest) {
        closestIntersection = intersection;
        closest = intersection.distance;
      }
    }
    return closestIntersection;
  }

  trace(ray, depth) {
    const intersection = this.intersectScene(ray);

    if (!intersection || !intersection.isHit) {
      return Color.black();
    }

    return this.illuminate(
      intersection.ray.dir,
      intersection.material,
      intersection.position,
      intersection.normal,
      depth
    );
  }

  render() {
    const { camera } = this.scene;

    const getPoint = (x, y) => {
      const xx =
        (2 * ((x + 0.5) * (1 / this.width)) - 1) *
        camera.angle *
        camera.aspectRatio;
      const yy = (1 - 2 * ((y + 0.5) * (1 / this.height))) * camera.angle;
      return camera.forward
        .add(camera.right.scalarMultiply(xx).add(camera.up.scalarMultiply(yy)))
        .normalize();
    };

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        const ray = new Ray(camera.position, getPoint(x, y));

        const color = this.trace(ray, 5).toDrawingColor();

        this.context.fillStyle = `rgb(${color.r},${color.g}, ${color.b})`;
        this.context.fillRect(x, y, 1, 1);
      }
    }
  }
}
