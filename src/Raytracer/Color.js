export default class Color {
  constructor(r: Number, g: Number, b: Number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  /**
   * @function {function black}
   * @return {Color} {description}
   */
  static black() {
    return new Color(0.0, 0.0, 0.0);
  }

  /**
   * @function {function blue}
   * @return {Color} {description}
   */
  static blue() {
    return new Color(0.0, 0.3, 0.6);
  }

  /**
   * @function {function white}
   * @return {Color} {description}
   */
  static white() {
    return new Color(1.0, 1.0, 1.0);
  }

  /**
   * @function {function grey}
   * @return {Color} {description}
   */
  static grey() {
    return new Color(0.5, 0.5, 0.5);
  }

  /**
   * @function {function background}
   * @return {Color} {description}
   */
  static background() {
    return Color.black();
  }

  /**
   * @function {function scalarMultiply}
   * @param  {Number} factor {description}
   * @return {Color} {description}
   */
  scalarMultiply(factor) {
    return new Color(this.r * factor, this.g * factor, this.b * factor);
  }

  /**
   * @function {function scalarDivide}
   * @param  {Number} factor {description}
   * @return {Color} {description}
   */
  scalarDivide(factor) {
    return new Color(this.r / factor, this.g / factor, this.b / factor);
  }

  /**
   * @function {function add}
   * @param  {Color} color {description}
   * @return {Color} {description}
   */
  add(color) {
    return new Color(this.r + color.r, this.g + color.g, this.b + color.b);
  }

  /**
   * @function {function multiply}
   * @param  {Color} color {description}
   * @return {Color} {description}
   */
  multiply(color) {
    return new Color(this.r * color.r, this.g * color.g, this.b * color.b);
  }

  /**
   * @function {function toDrawingColor}
   * @return {Color} {description}
   */
  toDrawingColor() {
    const legalize = (d) => (d > 1 ? 1 : d);
    return new Color(
      Math.floor(legalize(this.r) * 255),
      Math.floor(legalize(this.g) * 255),
      Math.floor(legalize(this.b) * 255)
    );
  }
}
