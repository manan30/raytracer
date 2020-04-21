import Color from './Color';

export default class Material {
  constructor(
    surfaceColor: Color | Function,
    kd: Number,
    ks: Number,
    ke: Number,
    kr: Number = 0.0,
    kt: Number = 0.0,
    ior: Number = 1.0
  ) {
    this.surfaceColor = surfaceColor;
    this.ka = 0.05;
    this.kd = kd;
    this.ks = ks;
    this.ke = ke;
    this.kr = kr;
    this.kt = kt;
    this.ior = ior;
  }
}
