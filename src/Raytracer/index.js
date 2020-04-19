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
    const that = this;

    // const invertedViewingDirection = new Vector(
    //   viewingDirection.z,
    //   viewingDirection.y,
    //   viewingDirection.x
    // ).normalize();

    let color = material.surfaceColor
      .multiply(material.ambientColor)
      .scalarMultiply(material.ambientConstant);

    let diffuseColor = new Color(0.0, 0.0, 0.0);
    let specularColor = new Color(0.0, 0.0, 0.0);

    this.scene.lights.forEach((light) => {
      const incomingLightDirection = light.position
        .subtract(intersectionPoint)
        .normalize();
      const distanceToLight = incomingLightDirection.length();
      const dotProduct = normal.dotProduct(incomingLightDirection);

      if (dotProduct >= 0.0) {
        const shadowRay = new Ray(intersectionPoint, incomingLightDirection);
        const shadowRayIntersection = that.intersectScene(shadowRay);
        if (
          shadowRayIntersection === null ||
          shadowRayIntersection.distance > distanceToLight
        ) {
          diffuseColor = diffuseColor
            .add(material.diffuseColor.scalarMultiply(dotProduct))
            .scalarMultiply(light.intensity)
            .add(material.surfaceColor)
            .multiply(light.color);
        }

        const reflectedRay = that.getReflectedRay(
          incomingLightDirection,
          normal
        );

        const view = ray.start.subtract(intersectionPoint).normalize();
        const dot = view.dotProduct(reflectedRay);

        if (dot <= 0.0) {
          return specularColor;
        }

        const specularAmount =
          dot ** material.specularConstant * light.intensity;

        specularColor = specularColor.add(
          new Color(specularAmount, specularAmount, specularAmount)
        );
      }
    });

    color = color.add(diffuseColor);
    color = color.add(specularColor);

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
      intersection.point,
      intersection.normal,
      intersection.ray,
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
