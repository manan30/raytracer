import Vector from './Vector';

export default class Camera {
  constructor(position, lookAt, fov) {
    this.position = position;
    this.lookAt = lookAt;
    this.fov = fov;

    this.eyeVector = Vector.normalize(
      Vector.subtract(this.lookAt, this.position)
    );

    this.vectorRight = Vector.scale(
      Vector.normalize(
        Vector.crossProduct(this.eyeVector, new Vector(0, -1, 0))
      ),
      1.5
    );

    this.vectorUp = Vector.scale(
      Vector.normalize(Vector.crossProduct(this.eyeVector, this.vectorRight)),
      1.5
    );
  }
}
