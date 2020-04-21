import Color from './Color';

export default class Material {
  constructor(
    surfaceColor: Color | Function,
    kd: Number,
    ks: Number,
    ke: Number,
    factor: Number
  ) {
    this.surfaceColor = surfaceColor;
    this.ka = 0.2;
    this.kd = kd;
    this.ks = ks;
    this.ke = ke;
    this.factor = factor;
  }
}
