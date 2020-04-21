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

  calculateReflectedColor(
    intersectionPoint,
    normal,
    viewingDirection,
    kr,
    depth
  ) {
    const reflectedRayOrigin = intersectionPoint.add(normal);

    const reflectedRayVector = viewingDirection
      .subtract(normal.scalarMultiply(2 * viewingDirection.dotProduct(normal)))
      .normalize();

    const reflectedRay = new Ray(reflectedRayOrigin, reflectedRayVector);

    return this.trace(reflectedRay, depth - 1).scalarMultiply(kr);
  }

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
    const { lights } = this.scene;
    let color = Color.black();

    const materialColor =
      typeof material.surfaceColor === 'function'
        ? material.surfaceColor(intersectionPoint)
        : material.surfaceColor;

    const ambientLight = getAmbientLight(materialColor, lights);
    color = color.add(ambientLight);

    for (let i = 0; i < lights.length; i += 1) {
      const incomingLightDirection = lights[i].position
        .subtract(intersectionPoint)
        .normalize();

      const shadowRay = new Ray(
        intersectionPoint.add(normal),
        incomingLightDirection
      );

      const shadowRayIntersection = this.isInShadow(shadowRay);

      if (
        shadowRayIntersection === null ||
        (!shadowRayIntersection.isHit &&
          shadowRayIntersection.distance >
            lights[i].distance(intersectionPoint) &&
          incomingLightDirection.dotProduct(normal) > 0)
      ) {
        const diffuseLight = getDiffuseLight(
          incomingLightDirection,
          lights[i],
          intersectionPoint,
          normal,
          materialColor,
          material.kd
        );

        color = color.add(diffuseLight);

        const reflectedRayVector = incomingLightDirection
          .subtract(
            normal.scalarMultiply(2 * incomingLightDirection.dotProduct(normal))
          )
          .normalize();

        const specularLight = getSpecularLight(
          lights[i],
          viewingDirection,
          reflectedRayVector,
          material
        );

        color = color.add(specularLight);
      }
    }

    // if (depth > 0) {
    //   if (material.kr > 0.0) {
    //     color = color.add(
    //       this.calculateReflectedColor(
    //         intersectionPoint,
    //         normal,
    //         viewingDirection,
    //         material.kr,
    //         depth
    //       )
    //     );
    //   }

    // if (material.kt > 0.0) {
    //   const transmittedRayVector = viewingDirection
    //     .clone()
    //     .normalize()
    //     .multiplyScalar(0.0000000000001);
    //   intersection.point.add(distance);

    //   let ni;
    //   let nt;
    //   let nit;
    //   let D;
    //   let N;

    //   ni = 1.0;
    //   nt = intersection.geometry.material.n;

    //   D = ray.direction.clone();
    //   N = intersection.normal.clone();
    //   DvN = D.clone().negate().dot(N);

    //   // inside-outside test
    //   if (DvN < 0) {
    //     ni = intersection.geometry.material.n; // inside
    //     nt = 1.0; // outside
    //     N = N.negate();
    //     DvN = D.clone().negate().dot(N);
    //   }

    //   nit = ni / nt;
    //   const discrim = Math.sqrt(
    //     1 + Math.pow(nit, 2) * (Math.pow(DvN, 2) - 1)
    //   );
    //   let reflectRayDirection = D.clone()
    //     .multiplyScalar(nit)
    //     .add(N.clone().multiplyScalar(DvN * nit - discrim));

    //   // Total internal reflection
    //   if (discrim < 0) {
    //     // create new ray
    //     const tmp = intersection.normal
    //       .clone()
    //       .multiplyScalar(2 * ray.direction.clone().dot(intersection.normal));
    //     reflectRayDirection = ray.direction.clone().sub(tmp);
    //   }

    //   // var distanceForward   = reflectRayDirection.clone().negate().normalize().multiplyScalar(0.0000000000001);
    //   // intersection.point.add(distanceForward);

    //   const reflectRay = new Ray(
    //     intersection.point.clone(),
    //     reflectRayDirection
    //   );

    //   transmitColor = self
    //     .illuminate(reflectRay, depth - 1)
    //     .multiplyScalar(intersection.geometry.material.kt);
    //   color = color.add(transmitColor);
    // }
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
      intersection.point,
      intersection.normal,
      intersection.ray.direction.scalarMultiply(-1.0),
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
