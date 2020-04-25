import Color from './Color';
import Intersection from './Intersection';
import { getAmbientLight, getDiffuseLight, getSpecularLight } from './Light';
import Material from './Material';
import Ray from './Ray';
import Scene from './Scene';
import Vector from './Vector';

/**
 * @class RayTracer
 */

export default class RayTracer {
  constructor(
    height: Number,
    width: Number,
    context: CanvasRenderingContext2D
  ) {
    this.scene = new Scene();
    this.height = height;
    this.width = width;
    this.context = context;
    this.rayTracedPixels = [];
    this.LD_MAX = 500;

    // console.log(this.context);
  }

  /**
   * @function {function isInShadow}
   * @param  {Ray} shadowRay {description}
   * @return {Intersection} {description}
   */
  isInShadow(shadowRay) {
    const shadowRayIntersection = this.intersectScene(shadowRay);
    return shadowRayIntersection;
  }

  /**
   * @function {function calculateReflectedColor}
   * @return {Color} {description}
   */
  calculateReflectedColor(
    intersectionPoint,
    normal,
    viewingDirection,
    kr,
    depth
  ) {
    const reflectedRayOrigin = intersectionPoint.add(
      normal.scalarMultiply(0.0000000000001)
    );

    const reflectedRayVector = viewingDirection
      .subtract(normal.scalarMultiply(viewingDirection.dotProduct(normal) * 2))
      .normalize();

    const reflectedRay = new Ray(reflectedRayOrigin, reflectedRayVector);

    return this.trace(reflectedRay, depth - 1).scalarMultiply(kr);
  }

  /**
   * @function {function name}
   * @param  {Vector} intersectionPoint {description}
   * @param  {Vector} viewingDirection  {description}
   * @param  {Vector} normal            {description}
   * @param  {Number} depth             {description}
   * @return {Color} {description}
   */
  calculateRefractedColor(
    intersectionPoint,
    viewingDirection,
    normal,
    depth,
    ior
  ) {
    const x = intersectionPoint.add(
      viewingDirection.scalarMultiply(0.0000000000001)
    );

    let eta1 = 1.0;
    let eta2 = ior;
    let refractedNormal = normal;

    let product = viewingDirection.dotProduct(normal);

    if (product < 0) {
      const temp = eta1;
      eta1 = eta2;
      eta2 = temp;
      refractedNormal = normal.scalarMultiply(-1.0);
      product = viewingDirection.dotProduct(normal.scalarMultiply(-1.0));
    }

    const eta = eta1 / eta2;
    const discriminant = Math.sqrt(1 + eta ** 2 * (product ** 2 - 1));

    let reflectRayDirection = viewingDirection
      .scalarMultiply(eta)
      .add(refractedNormal.scalarMultiply(product * eta - discriminant));

    if (discriminant < 0) {
      reflectRayDirection = viewingDirection
        .subtract(
          normal.scalarMultiply(viewingDirection.dotProduct(normal) * 2)
        )
        .normalize();
    }

    const reflectedRay = new Ray(x, reflectRayDirection);

    return this.trace(reflectedRay, depth - 1);
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
        intersectionPoint.add(normal.scalarMultiply(0.0000000000001)),
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

        const reflectedVector = incomingLightDirection
          .subtract(
            normal.scalarMultiply(incomingLightDirection.dotProduct(normal) * 2)
          )
          .normalize();

        const specularLight = getSpecularLight(
          lights[i],
          viewingDirection,
          reflectedVector,
          material
        );

        color = color.add(specularLight);
      }
    }

    if (depth > 0) {
      if (material.kr > 0.0) {
        color = color.add(
          this.calculateReflectedColor(
            intersectionPoint,
            normal,
            viewingDirection,
            material.kr,
            depth
          )
        );
      }
      if (material.kt > 0.0) {
        color = color.add(
          this.calculateRefractedColor(
            intersectionPoint,
            viewingDirection.scalarMultiply(-1.0),
            normal,
            depth,
            material.ior
          )
        );
      }
    }

    return color;
  }

  /**
   * @function {function intersectScene}
   * @param  {Ray} ray {description}
   * @return {Intersection | null} {description}
   */
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

  /**
   * @function {function trace}
   * @param  {Ray} ray   {description}
   * @param  {depth} depth {description}
   * @return {Color} {description}
   */
  trace(ray, depth) {
    const intersection = this.intersectScene(ray);

    if (intersection === null || !intersection.isHit) {
      return Color.black();
    }

    return this.illuminate(
      intersection.point,
      intersection.normal,
      intersection.ray.direction,
      intersection.material,
      depth
    );
  }

  toneReproduce() {
    // let luminanceSum = 0;

    // for (let i = 0; i < this.rayTracedPixels.length; i += 1) {
    //   const color = this.rayTracedPixels[i];
    //   luminanceSum += Math.log(
    //     0.000000001 +
    //       (100 * color.r * 0.27 + 100 * color.g * 0.67 + 100 * color.b * 0.06)
    //   );
    // }

    // const lBar = Math.exp(luminanceSum / this.rayTracedPixels.length);

    // const compressionNumerator = 1.219 + (this.LD_MAX / 2) ** 0.4;
    // const compressionDenominator = 1.219 + lBar ** 0.4;

    // const compression = (pixel) => {
    //   return (compressionNumerator / compressionDenominator) ** 2.5 * pixel;
    // };

    // const colors = [];

    // for (let i = 0; i < this.rayTracedPixels.length; i += 1) {
    //   const r = compression(this.rayTracedPixels[i].r) / this.LD_MAX;
    //   const g = compression(this.rayTracedPixels[i].g) / this.LD_MAX;
    //   const b = compression(this.rayTracedPixels[i].b) / this.LD_MAX;

    //   const color = new Color(r, g, b);
    //   colors.push(color.r);
    //   colors.push(color.g);
    //   colors.push(color.b);
    //   colors.push(255);
    // }

    // return colors;
    let luminanceSum = 0;

    console.log(this.rayTracedPixels);

    for (let i = 0; i < this.rayTracedPixels.length; i += 1) {
      const color = this.rayTracedPixels[i];
      luminanceSum += Math.log(
        0.000000001 +
          (100 * (color.r / 255) * 0.27 +
            100 * (color.g / 255) * 0.67 +
            100 * (color.b / 255) * 0.06)
      );
    }

    const lBar = 45.08127396621869;

    const compression = (pixel) => {
      const scaled = (100 * (pixel / 255) * 0.18) / lBar;
      return (scaled / (1 + scaled)) * this.LD_MAX;
    };

    const colors = [];

    for (let i = 0; i < this.rayTracedPixels.length; i += 1) {
      const r = compression((this.rayTracedPixels[i].r / this.LD_MAX) * 255);
      const g = compression((this.rayTracedPixels[i].g / this.LD_MAX) * 255);
      const b = compression((this.rayTracedPixels[i].b / this.LD_MAX) * 255);

      const color = new Color(r, g, b);
      colors.push(color.r);
      colors.push(color.g);
      colors.push(color.b);
      colors.push(255);
    }

    return colors;
  }

  /**
   * @function {function render}
   * @return {void} {description}
   */
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

        this.rayTracedPixels.push(color);
        // this.rayTracedPixels.push(color.r);
        // this.rayTracedPixels.push(color.g);
        // this.rayTracedPixels.push(color.b);
        // this.rayTracedPixels.push(255);
      }
    }

    const toneReproducedImg = this.toneReproduce();

    const imageData = this.context.createImageData(this.height, this.width);
    imageData.data.set(toneReproducedImg);
    this.context.putImageData(imageData, 0, 0);
    this.context.rotate(Math.PI / 2);
    this.context.canvas.style.transform = 'rotate(90deg)';
  }
}
