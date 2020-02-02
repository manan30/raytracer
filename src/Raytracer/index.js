/**
 * @class RayTracer
 */

export default class RayTracer {
  constructor(height, width, context) {
    this.scene = {
      camera: {
        position: { x: 0, y: 50, z: 300 },
        lookAt: { x: 0, y: 0, z: 0 },
        fov: 75
      },
      lights: { x: 200, y: 200, z: -300 },
      objects: [
        {
          type: 'plane',
          position: { x: 0, y: 0, z: 1 },
          color: { x: 0, y: 0, z: 0 }
        },
        {
          type: 'green-sphere',
          position: { x: 120, y: 70, z: -300 },
          color: { x: 255, y: 0, z: 0 },
          size: 50
        },
        {
          type: 'red-sphere',
          position: { x: 0, y: 20, z: -300 },
          color: { x: 255, y: 0, z: 0 },
          size: 50
        }
      ]
    };
    this.height = height;
    this.width = width;
    this.context = context;
    this.data = context.getImageData(0, 0, this.width, this.height);
  }

  sphereNormal(sphere, pos) {
    return this.vector.unitVector(this.vector.subtract(pos, sphere.position));
  }

  sphereIntersection(sphere, ray) {
    const eyeToCenter = this.vector.subtract(sphere.position, ray.point);
    const v = this.vector.dotProduct(eyeToCenter, ray.vector);

    if (v >= 0) {
      const eoDot = this.vector.dotProduct(eyeToCenter, eyeToCenter);
      const discriminant = sphere.size * sphere.size - (eoDot - v * v);
      if (discriminant >= 0) {
        return v - Math.sqrt(discriminant);
      }
    }
  }

  planeIntersection(object, ray) {
    const denom = this.vector.dotProduct(object.position, ray.vector);
    if (denom > 0) {
      return null;
    }
    const dist =
      (this.vector.dotProduct(object.position, ray.point) + 0.0) / -denom;
    return dist;
  }

  isLightVisible(pt, scene, light) {
    const distObject = this.intersectScene(
      {
        point: pt,
        vector: this.vector.unitVector(this.vector.subtract(pt, light))
      },
      scene
    );
    return distObject[0] > -0.005;
  }

  surface(ray, scene, object, pointAtTime, normal, depth) {
    const b = object.color;
    const c = this.vector.zero;
    let lambertAmount = 0;
    let contribution;

    // if (object.lambert) {
    // for (let i = 0; i < scene.lights.length; i += 1) {
    const lightPoint = scene.lights;

    // if (!this.isLightVisible(pointAtTime, scene, lightPoint)) {
    //   continue;
    // }
    contribution = this.vector.dotProduct(
      this.vector.unitVector(this.vector.subtract(lightPoint, pointAtTime)),
      normal
    );

    if (contribution > 0) {
      lambertAmount += contribution;
    }
    // }

    // if (object.specular) {
    //   const reflectedRay = {
    //     point: pointAtTime,
    //     vector: this.vector.reflectThrough(ray.vector, normal)
    //   };
    //   const reflectedColor = this.trace(reflectedRay, scene, (depth += 1));
    //   if (reflectedColor) {
    //     c = this.vector.add(
    //       c,
    //       this.vector.scale(reflectedColor, object.specular)
    //     );
    //   }
    //   // }
    // }
    lambertAmount = Math.min(1, lambertAmount);

    return this.vector.add3(
      c,
      this.vector.scale(b, lambertAmount * 0.7),
      this.vector.scale(b, 0.5)
    );
  }

  intersectScene(ray) {
    let closest = [Infinity, null];
    let dist;
    for (let i = 0; i < this.scene.objects.length; i += 1) {
      const object = this.scene.objects[i];

      if (i !== 0) dist = this.sphereIntersection(object, ray);
      // else dist = this.planeIntersection(object, ray);

      if (dist !== undefined && dist < closest[0]) {
        closest = [dist, object];
      }
    }
    return closest;
  }

  trace(ray, scene, depth) {
    if (depth > 5) {
      return {};
    }

    const distObject = this.intersectScene(ray);

    // console.log(distObject[0]);

    if (distObject[0] === Infinity) {
      return { x: 0, y: 0, z: 0 };
    }

    return { x: 255, y: 0, z: 0 };

    // const dist = distObject[0];
    // const object = distObject[1];
    // const pointAtTime = this.vector.add(
    //   ray.point,
    //   this.vector.scale(ray.vector, dist)
    // );

    // return this.surface(
    //   ray,
    //   scene,
    //   object,
    //   pointAtTime,
    //   this.sphereNormal(object, pointAtTime),
    //   depth
    // );
  }

  render() {
    const { camera } = this.scene;

    const eyeVector = this.vector.normalize(
      this.vector.subtract(camera.lookAt, camera.position)
    );

    // const vectorRight = this.vector.unitVector(
    //   this.vector.crossProduct(eyeVector, this.vector.up)
    // );
    const vectorRight = this.vector.scale(
      this.vector.normalize(
        this.vector.crossProduct(eyeVector, this.vector.up)
      ),
      1.5
    );
    // const vectorUp = this.vector.unitVector(
    //   this.vector.crossProduct(vectorRight, eyeVector)
    // );

    const vectorUp = this.vector.scale(
      this.vector.normalize(this.vector.crossProduct(eyeVector, vectorRight)),
      1.5
    );

    const fovRadians = (Math.PI * (camera.fov / 2)) / 180;
    const heightWidthRatio = this.height / this.width;
    const halfWidth = Math.tan(fovRadians);
    const halfHeight = heightWidthRatio * halfWidth;
    const cameraWidth = halfWidth * 2;
    const cameraHeight = halfHeight * 2;
    const pixelWidth = cameraWidth / (this.width - 1);
    const pixelHeight = cameraHeight / (this.height - 1);

    let index;
    let color;
    const ray = {
      point: camera.position
    };

    const getPoint = (x, y) => {
      const recenterX = x1 => (x1 - this.width / 2.0) / 2.0 / this.width;
      const recenterY = y1 => -(y1 - this.height / 2.0) / 2.0 / this.height;
      return this.vector.normalize(
        this.vector.add(
          eyeVector,
          this.vector.add(
            this.vector.scale(vectorRight, recenterX(x)),
            this.vector.scale(vectorUp, recenterY(y))
          )
        )
      );
    };

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        ray.vector = getPoint(x, y);
        color = this.trace(ray, this.scene, 0);

        this.context.fillStyle = `rgb(${color.x},${color.y}, ${color.z})`;
        this.context.fillRect(x, y, 1, 1);
      }
    }
  }
}
