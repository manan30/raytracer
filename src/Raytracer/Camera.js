import Vector from './Vector';

export default class Camera {
  constructor(position, lookAt, fov) {
    this.position = position;
    this.lookAt = lookAt;
    this.fov = fov;

    this.n = Vector.normalize(Vector.subtract(this.lookAt, this.position));
    this.u = Vector.scale(
      Vector.normalize(Vector.crossProduct(this.n, new Vector(0.0, -1.0, 0.0))),
      1.5
    );
    this.v = Vector.crossProduct(this.n, this.u);
  }
}
