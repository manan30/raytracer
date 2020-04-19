import Color from './Color';
import Material from './Material';
import Ray from './Ray';
import Scene from './Scene';
import Vector from './Vector';

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
  calculateLocalIllumination(position, normal, material, direction) {
    let i = 0.0;

    this.scene.lights.forEach((light) => {
      if (light.type === 'ambient') i += light.intensity;
      else {
        let x;
        if (light.type === 'point') {
          x = light.position.subtract(position);
        } else {
          x = light.position;
        }

        const diffuse = normal.dotProduct(x);
        if (diffuse > 0)
          i += ((diffuse * light.intensity) / normal.length()) * x.length();

        if (material.isSpecular) {
          const r = normal
            .scalarMultiply(2)
            .scalarMultiply(normal.dotProduct(x))
            .subtract(x);
          const specular = r.dotProduct(x, direction);
          if (specular > 0)
            i +=
              light.intensity *
              (specular / r.length()) *
              direction.length() ** material.specularConstant;
        }
      }
    });

    return material.surfaceColor.scalarMultiply(i);
  }

  /**
   * @function {function getReflectedRay}
   * @param  {Vector} direction {description}
   * @param  {Vector} normal    {description}
   * @return {Vector} {description}
   */
  // eslint-disable-next-line class-methods-use-this
  getReflectedRay(direction, normal) {
    return normal
      .scalarMultiply(2)
      .scalarMultiply(normal.dotProduct(direction))
      .subtract(direction);
  }

  // eslint-disable-next-line class-methods-use-this
  isInShadow(shadowRay, distanceToLight) {
    const shadowRayIntersection = this.intersectScene(shadowRay);

    return (
      shadowRayIntersection &&
      shadowRayIntersection.isHit &&
      shadowRayIntersection.distance < distanceToLight
    );
  }

  /**
   * @function {function illuminate}
   * @param  {Vector} intersectionPoint {description}
   * @param  {Vector} normal            {description}
   * @param  {Ray} ray  {description}
   * @param  {Material} material          {description}
   * @param  {number} depth             {description}
   * @return {Color} {description}
   */
  illuminate(intersectionPoint, normal, ray, material, depth) {
    let ambientColor = material.surfaceColor.scalarMultiply(material.ka);

    let diffuseColor = Color.background();
    let specularColor = Color.background();

    this.scene.lights.forEach((light) => {
      const incomingLightDirection = light.position
        .subtract(intersectionPoint)
        .normalize();
      const distanceToLight = intersectionPoint.dotProduct(light.position);

      const shadowRay = new Ray(intersectionPoint, light.position);

      if (!this.isInShadow(shadowRay, distanceToLight)) {
        const reflectedRay = this.getReflectedRay(ray, normal);

        diffuseColor = diffuseColor.add(
          light.color
            // .scalarMultiply(light.intensity)
            .add(material.surfaceColor)
            .scalarMultiply(incomingLightDirection.dotProduct(normal))
            .scalarMultiply(material.kd)
        );

        specularColor = specularColor.add(
          light.color
            // .scalarMultiply(light.intensity)
            .add(Color.white())
            .scalarMultiply(reflectedRay.dotProduct(ray) ** material.ke)
            .scalarMultiply(material.ks)
        );
      } else {
        ambientColor = ambientColor.add(Color.background());
      }
    });

    return ambientColor.add(diffuseColor).add(specularColor);
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
      intersection.point.normalize(),
      intersection.normal.normalize(),
      intersection.ray.direction.scalarMultiply(-1.0).normalize(),
      intersection.material,
      depth
    );
    // return intersection.material.surfaceColor;
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
