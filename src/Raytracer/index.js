import Camera from './Camera';
import Color from './Color';
import Plane from './Plane';
import Sphere from './Sphere';
import Vector from './Vector';
import Light from './Light';
import Ray from './Ray';

/**
 * @class RayTracer
 */

export default class RayTracer {
  constructor(height, width, context) {
    this.scene = {
      camera: new Camera(
        new Vector(3.0, -5.0, 30.0),
        new Vector(0.0, 0.0, 0.0),
        75
      ),
      lights: [
        new Light(new Vector(-5.0, 5.0, 5.0), new Color(0.4, 1.0, 0.8)),
        new Light(new Vector(10.0, 5.0, -5.0), new Color(0.6, 0.2, 0.0)),
      ],
      objects: [
        new Plane(
          'plane',
          new Vector(0.0, 1.0, 0.0),
          new Color(0.9, 0.9, 0.9),
          {
            diffuse: (pos) => {
              if ((Math.floor(pos.z) + Math.floor(pos.x)) % 2 !== 0) {
                return Color.white;
              }
              return Color.black;
            },
            specular: Color.white,
            reflection: (pos) => {
              if ((Math.floor(pos.z) + Math.floor(pos.x)) % 2 !== 0) {
                return 0.1;
              }
              return 0.7;
            },
            roughness: 150,
          }
        ),
        new Sphere(
          'sphere',
          new Vector(0.0, 1.0, -0.25),
          2.0,
          new Color(0.4, 1.0, 0.8),
          {
            diffuse: Color.white,
            specular: Color.grey,
            reflection: () => 0.7,
            roughness: 250,
          }
        ),
        new Sphere(
          'sphere',
          new Vector(-3.0, 0.5, 1.5),
          1.5,
          new Color(0.6, 0.2, 0.0),
          {
            diffuse: Color.white,
            specular: Color.grey,
            reflection: () => 0.7,
            roughness: 250,
          }
        ),
      ],
    };
    this.height = height;
    this.width = width;
    this.context = context;
  }

  spawnShadowRay(ray) {
    const intersection = this.intersectScene(ray);

    if (intersection != null) {
      return intersection.dist;
    }
    return undefined;
  }

  generateNaturalColor(object, position, normal, reflectionDir) {
    const lighting = (acc, light) => {
      const distance = Vector.subtract(light.position, position);
      const livec = Vector.normalize(distance);
      const neatIsect = this.spawnShadowRay(new Ray(position, livec));
      const isInShadow =
        neatIsect === undefined
          ? false
          : neatIsect <= Vector.magnitude(distance);
      if (isInShadow) {
        return acc;
      }
      const illum = Vector.dotProduct(livec, normal);
      const lcolor =
        illum > 0 ? Color.scale(illum, light.color) : Color.background;
      const specular = Vector.dotProduct(
        livec,
        Vector.normalize(reflectionDir)
      );
      const scolor =
        specular > 0
          ? Color.scale(specular ** object.surface.roughness, light.color)
          : Color.background;
      return Color.plus(
        acc,
        Color.plus(
          Color.times(
            object.name === 'sphere'
              ? object.surface.diffuse
              : object.surface.diffuse(position),
            lcolor
          ),
          Color.times(object.surface.specular, scolor)
        )
      );
    };
    return this.scene.lights.reduce(lighting, Color.background);
  }

  generateReflectionColor(
    object,
    position,
    normal,
    reflectionDirection,
    depth
  ) {
    return Color.scale(
      object.surface.reflection(position),
      this.trace({ start: position, dir: reflectionDirection }, depth + 1)
    );
  }

  intersectScene(ray) {
    let closest = +Infinity;
    let closestIntersection;
    for (let i = 0; i < this.scene.objects.length; i += 1) {
      const object = this.scene.objects[i];

      const intersection = object.intersect(ray);

      if (intersection !== null && intersection.dist < closest) {
        closestIntersection = intersection;
        closest = intersection.dist;
      }
    }
    return closestIntersection;
  }

  globalIllumination(intersection, depth) {
    const direction = intersection.ray.dir;
    const position = Vector.add(
      Vector.scale(direction, intersection.dist),
      intersection.ray.start
    );
    const normal = intersection.object.normal(position);
    const reflectionDirection = Vector.subtract(
      direction,
      Vector.scale(
        Vector.scale(normal, Vector.dotProduct(normal, direction)),
        2
      )
    );

    const naturalColor = Color.plus(
      Color.background,
      this.generateNaturalColor(
        intersection.object,
        position,
        normal,
        reflectionDirection
      )
    );

    const reflectedColor =
      depth >= 5
        ? Color.grey
        : this.generateReflectionColor(
            intersection.object,
            position,
            normal,
            reflectionDirection,
            depth
          );

    return Color.plus(naturalColor, reflectedColor);
  }

  trace(ray, depth) {
    const intersection = this.intersectScene(ray);

    if (!intersection) {
      return Color.toDrawingColor(Color.background);
    }

    return Color.toDrawingColor(this.globalIllumination(intersection, depth));
  }

  render() {
    const { camera } = this.scene;

    const getPoint = (x, y) => {
      const recenterX = (x1) => (x1 - this.width / 2.0) / 2.0 / this.width;
      const recenterY = (y1) => -(y1 - this.height / 2.0) / 2.0 / this.height;
      return Vector.normalize(
        Vector.add(
          camera.n,
          Vector.add(
            Vector.scale(camera.u, recenterX(x)),
            Vector.scale(camera.v, recenterY(y))
          )
        )
      );
    };

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        const color = this.trace(new Ray(camera.position, getPoint(x, y)), 0);

        this.context.fillStyle = `rgb(${color.r},${color.g}, ${color.b})`;
        this.context.fillRect(x, y, 1, 1);
      }
    }
  }
}
