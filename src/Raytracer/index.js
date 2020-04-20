import Color from './Color';
import Material from './Material';
import Ray from './Ray';
import Scene from './Scene';
import Vector from './Vector';
import { getAmbientLight, getDiffuseLight, getSpecularLight } from './Light';

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
    return direction
      .subtract(normal.scalarMultiply(2 * direction.dotProduct(normal)))
      .normalize();
  }

  isInShadow(shadowRay) {
    const shadowRayIntersection = this.intersectScene(shadowRay);
    return shadowRayIntersection;
  }

  // calculateReflectedLight(
  //   direction,
  //   normal,
  //   position,
  //   depth,
  //   reflectionCoeff,
  //   specularHighlight
  // ) {
  //   const reflectedVector = direction
  //     .subtract(normal.scalarMultiply(2 * direction.dotProduct(normal)))
  //     .normalize();
  //   const reflectedRay = new Ray(position.add(normal), reflectedVector);

  //   const incomingLight = this.trace(reflectedRay, depth - 1);

  //   return incomingLight
  //     .scalarMultiply(reflectionCoeff)
  //     .multiply(specularHighlight);
  // }

  /**
   * @function {function illuminate}
   * @param  {Vector} intersectionPoint {description}
   * @param  {Vector} normal            {description}
   * @param  {Vector} viewingDirection  {description}
   * @param  {Material} material          {description}
   * @param  {number} depth             {description}
   * @return {Color} {description}
   */
  illuminate(intersectionPoint, normal, viewingDirection, material, depth) {
    // const { lights } = this.scene;
    // let color = Color.black();
    // lights.forEach((light) => {
    //   const incomingLightDirection = light.position
    //     .subtract(intersectionPoint)
    //     .normalize();
    //   const ambientLight = getAmbientLight(material.surfaceColor, light);
    //   color = color.add(ambientLight);
    //   const shadowRay = new Ray(
    //     intersectionPoint.add(normal.scalarMultiply(0.0000000000001)),
    //     incomingLightDirection
    //   );
    //   const shadowRayIntersection = this.isInShadow(shadowRay);
    //   if (shadowRayIntersection === null) {
    //     const tempColor = Color.black();
    //     const diffuseLight = getDiffuseLight(
    //       incomingLightDirection,
    //       light,
    //       intersectionPoint,
    //       normal,
    //       material
    //     );
    //     const reflectedVector = normal
    //       .scalarMultiply(incomingLightDirection.dotProduct(normal) * 2)
    //       .subtract(incomingLightDirection)
    //       .normalize();
    //     const specularLight = getSpecularLight(
    //       light,
    //       viewingDirection,
    //       reflectedVector,
    //       material
    //     );
    //     color = color.add(
    //       tempColor.add(ambientLight).add(diffuseLight).add(specularLight)
    //     );
    //   }
    // });
    // return color;
    let color = new Color(0, 0, 0);
    const { lights } = this.scene;
    for (let i = 0; i < lights.length; i += 1) {
      const directionToLight = lights[i].position
        .subtract(intersectionPoint)
        .normalize();
      const shadowRay = new Ray(
        intersectionPoint.add(normal.scalarMultiply(0.00001)),
        directionToLight
      );
      const shadowRayIntersection = this.isInShadow(shadowRay);
      if (
        shadowRayIntersection === null ||
        (!shadowRayIntersection.isHit &&
          shadowRayIntersection.distance >
            lights[i].distance(intersectionPoint) &&
          directionToLight.dotProduct(normal) > 0)
      ) {
        const { color: lColor } = lights[i];
        const genColor = lColor.multiply(
          material.surfaceColor.scalarMultiply(
            normal.dotProduct(directionToLight)
          )
        );

        color = color.add(genColor);

        // if (depth > 1 && material.isSpecular) {
        //   color = color.add(
        //     this.calculateReflectedLight(
        //       direction,
        //       normal,
        //       position,
        //       depth,
        //       material.reflection,
        //       material.specular
        //     )
        //   );
        // }
      }
    }
    // if (depth > 1 && material.isTransparent) {
    //   color = color.add(
    //     this.calculateRefractedLight(direction, normal, position, depth)
    //   );
    // }
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

    if (intersection === null || !intersection.isHit) {
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
