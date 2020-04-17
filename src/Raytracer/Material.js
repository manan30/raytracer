export default class Material {
  constructor(
    diffuse,
    specular,
    isSpecular = false,
    reflection = 0.0,
    isTransparent = false,
    refraction = 0.0
  ) {
    this.diffuse = diffuse;
    this.specular = specular;
    this.isSpecular = isSpecular;
    this.reflection = reflection;
    this.isTransparent = isTransparent;
    this.refraction = refraction;
  }
}
