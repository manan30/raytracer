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

  spawnShadowRay(ray) {
    const intersection = this.intersectScene(ray);
    return intersection;
  }

  // eslint-disable-next-line class-methods-use-this
  getRefractedRay(direction, normal, n1, n2) {
    let c1 = normal.dotProduct(direction);
    let eta1 = n1;
    let eta2 = n2;

    let refractedNormal = normal;

    if (c1 < 0) {
      c1 = -c1;
    } else {
      refractedNormal = refractedNormal.scalarMultiply(-1);
      const temp = eta1;
      eta1 = eta2;
      eta2 = temp;
    }

    const eta = eta1 / eta2;
    const c2 = Math.sqrt(1 - eta ** 2 * (1 - c1 ** 2));

    return c2 < 0
      ? null
      : direction
          .scalarMultiply(eta)
          .add(refractedNormal.scalarMultiply(eta * c1 - c2))
          .normalize();
  }

  illuminate(direction, material, position, normal, depth) {
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

      const incomingLight = this.trace(reflectedRay, depth - 1);

      color = color.add(
        incomingLight
          .scalarMultiply(material.reflection)
          .multiply(material.specular)
      );
    }

    if (depth > 1 && material.isTransparent) {
      const refractedVector = this.getRefractedRay(direction, normal, 1.5, 1.0);

      if (refractedVector !== null) {
        const outside = direction.dotProduct(normal) < 0;
        const bias = normal.scalarMultiply(0.0001);
        const refractedRayDirection = outside
          ? position.add(bias)
          : position.subtract(bias);
        const refractedRay = new Ray(refractedRayDirection, refractedVector);

        const incomingLight = this.trace(refractedRay, depth - 1);

        color = color.add(incomingLight);
      }
    }

    return color;
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
