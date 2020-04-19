import Vector from './Vector';
import Color from './Color';

export default class Light {
  constructor(type: String, position: Vector, color: Color, intensity: Number) {
    this.type = type;
    this.position = position;
    this.color = color;
    this.intensity = intensity;
  }
}
