import Camera from './Camera';
import Color from './Color';
import Plane from './Plane';
import Sphere from './Sphere';
import Vector from './Vector';

/**
 * @class RayTracer
 */

export default class RayTracer {
  constructor(height, width, context) {
    this.scene = {
      camera: new Camera(
        new Vector(3.0, -5.0, -30.0),
        new Vector(0.0, 0.0, 0.0),
        75
      ),
      // lights: new Vector(200, 200, -300),
      objects: [
        new Plane('plane', new Vector(0.0, 1.0, 0.0), new Color(0.9, 0.9, 0.9)),
        new Sphere(
          'green',
          new Vector(0.0, 1.0, -0.25),
          0.8,
          new Color(0.4, 1.0, 0.8)
        ),
        new Sphere(
          'red',
          new Vector(-1.0, 0.5, 1.5),
          1.0,
          new Color(0.6, 0.2, 0.0)
        )
      ]
    };
    this.height = height;
    this.width = width;
    this.context = context;
  }

  intersectScene(ray) {
    let closest = +Infinity;
    let dist;
    let closestObject;
    for (let i = 0; i < this.scene.objects.length; i += 1) {
      const object = this.scene.objects[i];

      dist = object.intersect(ray);

      if (dist !== null && dist < closest) {
        closest = dist;
        closestObject = object;
      }
    }
    return { closestObject, closest };
  }

  trace(ray) {
    const { closestObject, closest: dist } = this.intersectScene(ray);

    if (dist === Infinity) {
      return Color.toDrawingColor(Color.background);
    }

    return Color.toDrawingColor(closestObject.color);
  }

  render() {
    const { camera } = this.scene;
    const ray = {
      point: camera.position
    };

    const getPoint = (x, y) => {
      const recenterX = x1 => (x1 - this.width / 2.0) / 2.0 / this.width;
      const recenterY = y1 => -(y1 - this.height / 2.0) / 2.0 / this.height;
      return Vector.normalize(
        Vector.add(
          camera.eyeVector,
          Vector.add(
            Vector.scale(camera.vectorRight, recenterX(x)),
            Vector.scale(camera.vectorUp, recenterY(y))
          )
        )
      );
    };

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        ray.vector = getPoint(x, y);
        const color = this.trace(ray, 0);

        this.context.fillStyle = `rgb(${color.r},${color.g}, ${color.b})`;
        this.context.fillRect(x, y, 1, 1);
      }
    }
  }
}
