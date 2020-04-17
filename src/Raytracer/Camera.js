import Vector from './Vector';

export default class Camera {
  constructor(position, lookAt, fov, aspectRatio) {
    this.position = position;
    this.lookAt = lookAt;
    this.fov = fov;

    this.angle = Math.tan((Math.PI * 0.5 * fov) / 180);

    this.aspectRatio = aspectRatio;

    this.forward = this.lookAt.subtract(this.position).normalize();
    this.right = this.forward
      .crossProduct(new Vector(0.0, -1.0, 0.0))
      .normalize();
    this.up = this.forward.crossProduct(this.right);
  }
}
