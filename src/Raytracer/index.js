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
  clamp(one, two, three) {
    return Math.max(one, Math.min(two, three));
  }

  spawnShadowRay(ray) {
    const intersection = this.intersectScene(ray);
    return intersection;
  }

  // eslint-disable-next-line class-methods-use-this
  calculateFresnelValue(direction, normal, n1, n2) {
    let c1 = this.clamp(-1, 1, normal.dotProduct(direction));
    let eta1 = n1;
    let eta2 = n2;

    if (c1 > 0) {
      const temp = eta1;
      eta1 = eta2;
      eta2 = temp;
    }

    const sine = (eta1 / eta2) * Math.sqrt(Math.max(0.0, 1 - c1 * c1));

    if (sine >= 1) {
      return 1;
    }

    const cosine = Math.sqrt(Math.max(0.0, 1 - sine * sine));
    c1 = Math.abs(c1);
    const rs = (eta2 * c1 - eta1 * cosine) / (eta2 * c1 + eta1 * cosine);
    const rp = (eta1 * c1 - eta2 * cosine) / (eta1 * c1 + eta2 * cosine);
    return (rs * rs + rp * rp) / 2;
  }

  // eslint-disable-next-line class-methods-use-this
  getRefractedRay(direction, normal, n1, n2) {
    let c1 = this.clamp(-1, 1, normal.dotProduct(direction));
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

  calculateReflectedLight(direction, normal, position, depth, reflectionCoeff) {
    const reflectedVector = direction
      .subtract(normal.scalarMultiply(2 * direction.dotProduct(normal)))
      .normalize();
    const reflectedRay = new Ray(position.add(normal), reflectedVector);

    const incomingLight = this.trace(reflectedRay, depth - 1);

    return incomingLight.scalarMultiply(reflectionCoeff);
  }

  calculateRefractedLight(direction, normal, position, depth) {
    const fresnel = this.calculateFresnelValue(direction, normal, 1.5, 1.0);
    const outside = direction.dotProduct(normal) < 0;
    const bias = normal.scalarMultiply(0.0001);
    let color = Color.background();

    if (fresnel < 1) {
      const refractedVector = this.getRefractedRay(direction, normal, 1.5, 1.0);
      if (refractedVector !== null) {
        const refractedRayDirection = outside
          ? position.add(bias)
          : position.subtract(bias);
        const refractedRay = new Ray(refractedRayDirection, refractedVector);

        color = color.add(
          this.trace(refractedRay, depth - 1).scalarMultiply(fresnel)
        );
      }
    }

    const reflectedVector = direction
      .subtract(normal.scalarMultiply(2 * direction.dotProduct(normal)))
      .normalize();
    const reflectedRayDirection = outside
      ? position.add(bias)
      : position.subtract(bias);
    const reflectedRay = new Ray(reflectedRayDirection, reflectedVector);

    color = color.add(
      this.trace(reflectedRay, depth - 1).scalarMultiply(1 - fresnel)
    );

    return color;
  }

  illuminate(direction, material, position, normal, depth) {
    let color = new Color(0, 0, 0);

    const { lights } = this.scene;

    for (let i = 0; i < lights.length; i += 1) {
      const directionToLight = lights[i].position
        .subtract(position)
        .normalize();
      const shadowRay = new Ray(
        position.add(normal.scalarMultiply(0.00001)),
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
      color = color.add(
        this.calculateReflectedLight(
          direction,
          normal,
          position,
          depth,
          material.reflection
        )
      );
    }

    if (depth > 1 && material.isTransparent) {
      color = color.add(
        this.calculateRefractedLight(direction, normal, position, depth)
      );
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
