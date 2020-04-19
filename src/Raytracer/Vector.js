export default class Vector {
  constructor(x: Number, y: Number, z: Number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * @function {function add}
   * @param  {Vector} vector {description}
   * @return {Vector} {description}
   */
  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  /**
   * @function {function subtract}
   * @param  {Vector} vector {description}
   * @return {Vector} {description}
   */
  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  /**
   * @function {function dotProduct}
   * @param  {Vector} vector {description}
   * @return {Number} {description}
   */
  dotProduct(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  /**
   * @function {function crossProduct}
   * @param  {Vector} vector {description}
   * @return {Vector} {description}
   */
  crossProduct(vector) {
    return new Vector(
      this.y * vector.z - this.z * vector.y,
      this.x * vector.z - this.z * vector.x,
      this.x * vector.y - this.y * vector.x
    );
  }

  /**
   * @function {function scalarMultiply}
   * @param  {factor} factor {description}
   * @return {Vector} {description}
   */
  scalarMultiply(factor) {
    return new Vector(this.x * factor, this.y * factor, this.z * factor);
  }

  /**
   * @function {function scalarDivide}
   * @param  {factor} factor {description}
   * @return {Vector} {description}
   */
  scalarDivide(factor) {
    return new Vector(this.x / factor, this.y / factor, this.z / factor);
  }

  /**
   * @function {function length}
   * @return {Number} {description}
   */
  length() {
    return Math.sqrt(this.dotProduct(this));
  }

  /**
   * @function {function distance}
   * @param  {Vector} vector {description}
   * @return {Number} {description}
   */
  distance(vector) {
    return vector.subtract(this).length();
  }

  /**
   * @function {function normalize}
   * @return {Vector} {description}
   */
  normalize() {
    const length = this.length();
    return this.scalarDivide(length);
  }
}
