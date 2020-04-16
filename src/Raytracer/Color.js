export default class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  black = new Color(0.0, 0.0, 0.0);

  blue = new Color(0.0, 0.3, 0.6);

  white = new Color(1.0, 1.0, 1.0);

  grey = new Color(0.5, 0.5, 0.5);

  background = Color.black;

  scalarMultiply(factor) {
    return new Color(this.r * factor, this.g * factor, this.b * factor);
  }

  scalarDivide(factor) {
    return new Color(this.r / factor, this.g / factor, this.b / factor);
  }

  add(color) {
    return new Color(this.r + color.r, this.g + color.g, this.b + color.b);
  }

  multiply(color) {
    return new Color(this.r * color.r, this.g * color.g, this.b * color.b);
  }

  clamp(lower, upper) {
    return new Color(
      Math.max(lower, Math.min(this.r, upper)),
      Math.max(lower, Math.min(this.g, upper)),
      Math.max(lower, Math.min(this.b, upper))
    );
  }

  toDrawingColor() {
    const legalize = (d) => (d > 1 ? 1 : d);
    return new Color(
      Math.floor(legalize(this.r) * 255),
      Math.floor(legalize(this.g) * 255),
      Math.floor(legalize(this.b) * 255)
    );
  }
}
