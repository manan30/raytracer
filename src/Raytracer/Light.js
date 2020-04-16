import Vector from './Vector';

export default class Light {
  constructor(position, color) {
    this.position = position;
    this.color = color;
    this.attenuation = new Vector(0, 0, 1);
  }

  distance(point) {
    this.position.distance(point);
  }

  intensityAt(point) {
    const distance = this.distance(point);
    const intensity = this.power.scalarDivide(
      this.attenuation.x +
        this.attenuation.y * distance +
        this.attenuation.z * distance * distance
    );
    return intensity;
  }
}
