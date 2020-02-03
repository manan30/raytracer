import Sphere from './Sphere';
import Vector from './Vector';

/**
 * @class RayTracer
 */

export default class RayTracer {
  constructor(height, width, context) {
    this.scene = {
      camera: {
        position: new Vector(0, 50, 300),
        lookAt: new Vector(0, 0, 0),
        fov: 75
      },
      lights: new Vector(200, 200, -300),
      objects: [
        {
          type: 'plane',
          position: new Vector(0, 0, 1)
        },
        new Sphere('green', new Vector(120, 70, -300), 50),
        new Sphere('red', new Vector(0, 20, -300), 50)
      ]
    };
    this.height = height;
    this.width = width;
    this.context = context;
  }

  // planeIntersection(object, ray) {
  //   const denom = this.vector.dotProduct(object.position, ray.vector);
  //   if (denom > 0) {
  //     return null;
  //   }
  //   const dist =
  //     (this.vector.dotProduct(object.position, ray.point) + 0.0) / -denom;
  //   return dist;
  // }

  intersectScene(ray) {
    let closest = [Infinity, null];
    let dist;
    for (let i = 0; i < this.scene.objects.length; i += 1) {
      const object = this.scene.objects[i];

      if (i !== 0) dist = object.intersect(ray);
      // else dist = this.planeIntersection(object, ray);

      if (dist !== undefined && dist < closest[0]) {
        closest = [dist, object];
      }
    }
    return closest;
  }

  trace(ray, depth) {
    if (depth > 5) {
      return {};
    }

    const distObject = this.intersectScene(ray);

    if (distObject[0] === Infinity) {
      return { x: 0, y: 0, z: 0 };
    }

    return { x: 255, y: 0, z: 0 };
  }

  render() {
    const { camera } = this.scene;

    const eyeVector = Vector.normalize(
      Vector.subtract(camera.lookAt, camera.position)
    );

    const vectorRight = Vector.scale(
      Vector.normalize(Vector.crossProduct(eyeVector, new Vector(0, -1, 0))),
      1.5
    );

    const vectorUp = Vector.scale(
      Vector.normalize(Vector.crossProduct(eyeVector, vectorRight)),
      1.5
    );

    let color;
    const ray = {
      point: camera.position
    };

    const getPoint = (x, y) => {
      const recenterX = x1 => (x1 - this.width / 2.0) / 2.0 / this.width;
      const recenterY = y1 => -(y1 - this.height / 2.0) / 2.0 / this.height;
      return Vector.normalize(
        Vector.add(
          eyeVector,
          Vector.add(
            Vector.scale(vectorRight, recenterX(x)),
            Vector.scale(vectorUp, recenterY(y))
          )
        )
      );
    };

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        ray.vector = getPoint(x, y);
        color = this.trace(ray, 0);

        this.context.fillStyle = `rgb(${color.x},${color.y}, ${color.z})`;
        this.context.fillRect(x, y, 1, 1);
      }
    }
  }
}
