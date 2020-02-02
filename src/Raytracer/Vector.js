export default class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static add(vector1, vector2) {
    return new Vector(
      vector1.x + vector2.x,
      vector1.y + vector2.y,
      vector1.z + vector2.z
    );
  }

  static subtract(vector1, vector2) {
    return new Vector(
      vector1.x - vector2.x,
      vector1.y - vector2.y,
      vector1.z - vector2.z
    );
  }

  static dotProduct(vector1, vector2) {
    return (
      vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z
    );
  }

  static crossProduct(vector1, vector2) {
    return new Vector(
      vector1.y * vector2.z - vector1.z * vector2.y,
      vector1.z * vector2.x - vector1.x * vector2.z,
      vector1.x * vector2.y - vector1.y * vector2.x
    );
  }

  static magnitude(vector) {
    return Math.sqrt(
      vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
    );
  }

  static scale(vector, factor) {
    return new Vector(vector.x * factor, vector.y * factor, vector.z * factor);
  }

  static normalize(vector) {
    const mag = this.magnitude(vector);
    const div = mag === 0 ? Infinity : 1.0 / mag;
    return this.scale(vector, div);
  }

  static length(vector) {
    return Math.sqrt(this.dotProduct(vector, vector));
  }
}
