import Vector from './Vector';
import Color from './Color';

export default class Light {
  constructor(type: String, position: Vector, color: Color, intensity: Number) {
    this.type = type;
    this.position = position;
    this.color = color;
    this.intensity = intensity;
    this.attenuation = new Vector(0, 0, 1);
  }

  intensityAt(point) {
    const distance = this.position.distance(point);
    const intensity = this.color.scalarDivide(
      this.attenuation.x +
        this.attenuation.y * distance +
        this.attenuation.z * distance * distance
    );
    return intensity;
  }
}
