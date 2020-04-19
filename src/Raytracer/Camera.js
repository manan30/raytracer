import Vector from './Vector';

export default class Camera {
  constructor(position: Vector, lookAt: Vector) {
    this.position = position;
    this.lookAt = lookAt;
    this.fov = 60;

    this.angle = Math.tan((Math.PI * 0.5 * this.fov) / 180);

    this.aspectRatio = 1.0;

    this.forward = this.lookAt.subtract(this.position).normalize();
    this.right = new Vector(0.0, -1.0, 0.0)
      .crossProduct(this.forward)
      .normalize();
    this.up = this.forward.crossProduct(this.right);
  }
}
