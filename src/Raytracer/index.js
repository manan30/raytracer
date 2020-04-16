import Color from './Color';
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
  }

  spawnShadowRay(ray) {
    const intersection = this.intersectScene(ray);

    return intersection.isHit ? intersection.distance : undefined;
  }

  generateNaturalColor(material, position, normal, reflectionDir) {
    const lighting = (acc, light) => {
      const distance = light.position.subtract(position);
      const livec = distance.normalize();
      const neatIsect = this.spawnShadowRay(new Ray(position, livec));
      const isInShadow =
        neatIsect === undefined ? false : neatIsect <= distance.magnitude();
      if (isInShadow) {
        return acc;
      }
      const illum = livec.dotProduct(normal);
      const lcolor =
        illum > 0 ? light.color.scalarMultiply(illum) : new Color().black;
      const specular = Vector.dotProduct(livec, reflectionDir.normalize());
      const scolor =
        specular > 0
          ? light.color.scalarMultiply(specular ** material.roughness)
          : Color.background;
      return acc.plus(
        lcolor
          .scalarMultiply(material.diffuse(position))
          .add(material.specular.multiply(scolor))
      );
    };
    return this.scene.lights.reduce(lighting, Color.background);
  }

  generateReflectionColor(
    material,
    position,
    normal,
    reflectionDirection,
    depth
  ) {
    const ray = new Ray(position, reflectionDirection);
    return this.trace(ray, depth + 1).scalarMultiply(
      material.reflection(position)
    );
  }

  intersectScene(ray) {
    let closest = +Infinity;
    let closestIntersection;
    for (let i = 0; i < this.scene.objects.length; i += 1) {
      const object = this.scene.objects[i];

      const intersection = object.intersect(ray);

      if (intersection !== null && intersection.distance < closest) {
        closestIntersection = intersection;
        closest = intersection.distance;
      }
    }
    return closestIntersection;
  }

  globalIllumination(intersection, depth) {
    const direction = intersection.ray.dir;
    const { position, normal, material } = intersection;
    const reflectionDirection = direction.subtract(
      normal.scalarMultiply(normal.dotProduct(direction)).scalarMultiply(2)
    );

    const naturalColor = Color.background.add(
      this.generateNaturalColor(material, position, normal, reflectionDirection)
    );

    const reflectedColor =
      depth >= 5
        ? new Color().grey
        : this.generateReflectionColor(
            material,
            position,
            normal,
            reflectionDirection,
            depth
          );

    return naturalColor.add(reflectedColor);
  }

  trace(ray, depth) {
    const intersection = this.intersectScene(ray);

    if (!intersection || !intersection.isHit) {
      return new Color(Color.background).toDrawingColor();
    }

    return new Color(
      this.globalIllumination(intersection, depth)
    ).toDrawingColor();
  }

  render() {
    const { camera } = this.scene;

    const getPoint = (x, y) => {
      const recenterX = (x1) => (x1 - this.width / 2.0) / 2.0 / this.width;
      const recenterY = (y1) => -(y1 - this.height / 2.0) / 2.0 / this.height;
      return camera.n
        .add(
          camera.u
            .scalarMultiply(recenterX(x))
            .add(camera.v.scalarMultiply(recenterY(y)))
        )
        .normalize();
    };

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        const color = this.trace(new Ray(camera.position, getPoint(x, y)), 0);

        console.log(color);

        this.context.fillStyle = `rgb(${color.r},${color.g}, ${color.b})`;
        this.context.fillRect(x, y, 1, 1);
      }
    }
  }
}
