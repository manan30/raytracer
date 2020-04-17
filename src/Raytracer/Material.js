export default class Material {
  constructor(diffuse, specular, isSpecular, reflection, roughness = 0.0) {
    this.diffuse = diffuse;
    this.specular = specular;
    this.isSpecular = isSpecular;
    this.reflection = reflection;
    this.roughness = roughness;
  }
}
