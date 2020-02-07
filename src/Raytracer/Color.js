export default class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static black = new Color(0.0, 0.0, 0.0);

  static blue = new Color(0.0, 0.3, 0.6);

  static background = Color.black;

  static toDrawingColor(c) {
    const legalize = d => (d > 1 ? 1 : d);
    return {
      r: Math.floor(legalize(c.r) * 255),
      g: Math.floor(legalize(c.g) * 255),
      b: Math.floor(legalize(c.b) * 255)
    };
  }
}
