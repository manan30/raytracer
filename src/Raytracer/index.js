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
  }

  spawnShadowRay(ray) {
    const intersection = this.intersectScene(ray);
    return intersection;
  }

  generateNaturalColor(direction, material, position, normal, depth) {
    let color = new Color(0, 0, 0);

    const { lights } = this.scene;

    for (let i = 0; i < lights.length; i += 1) {
      const directionToLight = lights[i].position
        .subtract(position)
        .normalize();
      const shadowRay = new Ray(
        position.add(directionToLight.scalarMultiply(0.00001)),
        directionToLight
      );
      const shadowRayIntersection = this.spawnShadowRay(shadowRay);
      if (
        shadowRayIntersection === null ||
        (!shadowRayIntersection.isHit &&
          shadowRayIntersection.distance > lights[i].distance(position) &&
          directionToLight.dotProduct(normal) > 0)
      ) {
        const intensity = lights[i].intensityAt(position);
        const genColor = intensity.multiply(
          material
            .diffuse(position)
            .scalarMultiply(normal.dotProduct(directionToLight))
        );
        color = color.add(genColor);
      }
    }

    if (depth > 1 && material.isSpecular) {
      const reflectedVector = direction.subtract(
        normal.scalarMultiply(2 * normal.dotProduct(direction))
      );
      const reflectedRay = new Ray(position.add(normal), reflectedVector);

      const incomingLight = this.trace(reflectedRay, depth + 1);

      color = color.add(
        incomingLight
          .scalarMultiply(material.reflection)
          .multiply(material.specular)
      );
    }

    return color;
  }

  generateReflectionColor(
    material,
    position,
    normal,
    reflectionDirection,
    depth
  ) {
    const ray = new Ray(position, reflectionDirection);
    return this.trace(ray, depth + 1).scalarMultiply(material.reflection);
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

  globalIllumination(intersection, depth) {
    const direction = intersection.ray.dir;
    const { position, normal, material } = intersection;

    const color = Color.background().add(
      this.generateNaturalColor(direction, material, position, normal, depth)
    );

    return color;
  }

  trace(ray, depth) {
    const intersection = this.intersectScene(ray);

    if (!intersection || !intersection.isHit) {
      return Color.black();
    }

    return this.globalIllumination(intersection, depth);
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
