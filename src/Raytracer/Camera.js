import Vector from './Vector';

export default class Camera {
  constructor(position, lookAt, fov) {
    this.position = position;
    this.lookAt = lookAt;
    this.fov = fov;

    this.n = this.lookAt.subtract(this.position).normalize();
    this.u = this.n
      .crossProduct(new Vector(0.0, -1.0, 0.0))
      .normalize()
      .scalarMultiply(1.5);
    this.v = this.n.crossProduct(this.u);
  }
}
