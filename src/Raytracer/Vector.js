export default class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  dotProduct(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  crossProduct(vector) {
    return new Vector(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    );
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  scalarMultiply(factor) {
    return new Vector(this.x * factor, this.y * factor, this.z * factor);
  }

  scalarDivide(factor) {
    return new Vector(this.x / factor, this.y / factor, this.z / factor);
  }

  length() {
    return Math.sqrt(this.dotProduct(this));
  }

  distance(vector) {
    return vector.subtract(this).length();
  }

  equals(vector) {
    return this.x === vector.x && this.y === vector.y && this.z === vector.z;
  }

  static normalize() {
    const magnitude = this.length();
    return new Vector(
      this.x / magnitude,
      this.y / magnitude,
      this.z / magnitude
    );
  }
}
