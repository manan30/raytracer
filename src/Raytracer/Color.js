export default class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static black = new Color(0.0, 0.0, 0.0);

  static blue = new Color(0.0, 0.3, 0.6);

  static white = new Color(1.0, 1.0, 1.0);

  static grey = new Color(0.5, 0.5, 0.5);

  static background = Color.black;

  static scale(k, color) {
    return new Color(k * color.r, k * color.g, k * color.b);
  }

  static plus(color1, color2) {
    return new Color(
      color1.r + color2.r,
      color1.g + color2.g,
      color1.b + color2.b
    );
  }

  static times(color1, color2) {
    return new Color(
      color1.r * color2.r,
      color1.g * color2.g,
      color1.b * color2.b
    );
  }

  static toDrawingColor(c) {
    const legalize = d => (d > 1 ? 1 : d);
    return {
      r: Math.floor(legalize(c.r) * 255),
      g: Math.floor(legalize(c.g) * 255),
      b: Math.floor(legalize(c.b) * 255)
    };
  }
}
