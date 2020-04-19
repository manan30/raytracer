import Color from './Color';

export default class Material {
  constructor(
    surfaceColor: Color,
    ambientColor: Color,
    ambientConstant: Number,
    diffuseColor: Color,
    diffuseConstant: Number,
    specularColor: Color,
    specularConstant: Number
  ) {
    this.surfaceColor = surfaceColor;
    this.ambientColor = ambientColor;
    this.ambientConstant = ambientConstant;
    this.diffuseColor = diffuseColor;
    this.diffuseConstant = diffuseConstant;
    this.specularColor = specularColor;
    this.specularConstant = specularConstant;
  }
}
