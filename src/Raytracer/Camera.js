import Vector from './Vector';

export default class Camera {
  constructor(
    position: Vector,
    lookAt: Vector,
    fov: Number,
    aspectRatio: Number
  ) {
    this.position = position;
    this.lookAt = lookAt;
    this.fov = fov;

    this.angle = Math.tan((Math.PI * 0.5 * fov) / 180);

    this.aspectRatio = aspectRatio;

    this.forward = this.lookAt.subtract(this.position).normalize();
    this.right = new Vector(0.0, 1.0, 0.0)
      .crossProduct(this.forward)
      .normalize();
    this.up = this.forward.crossProduct(this.right);
  }
}
