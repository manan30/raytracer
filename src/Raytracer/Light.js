import Vector from './Vector';
import Color from './Color';
import Material from './Material';

export default class Light {
  constructor(position: Vector, color: Color, intensity: Color) {
    this.position = position;
    this.color = color;
    this.intensity = intensity;
  }

  // intensityAt(point) {
  //   const distance = this.position.distance(point);
  //   const intensity = this.color.scalarDivide(
  //     this.attenuation.x +
  //       this.attenuation.y * distance +
  //       this.attenuation.z * distance * distance
  //   );
  //   return intensity;
  // }
}

export function getAmbientLight(surfaceColor: Color, light: Light) {
  const comp = 0.5;
  let ambientColor = Color.black();

  ambientColor = ambientColor.add(light.color.scalarMultiply(comp));

  return ambientColor.multiply(surfaceColor).scalarMultiply(0.33);
}

export function getDiffuseLight(
  incomingLightDirection: Vector,
  light: Light,
  intersectionPoint: Vector,
  normal: Vector,
  material: Material
) {
  let diffuseLight = Color.black();

  const scalarVals = incomingLightDirection.dotProduct(normal);

  const tmpColor = light.intensity;
  const objectColor = material.surfaceColor;

  const finalColor = tmpColor.multiply(objectColor).scalarMultiply(scalarVals);

  diffuseLight = diffuseLight.add(finalColor);

  return diffuseLight.scalarMultiply(0.333);
}

export function getSpecularLight(
  light: Light,
  viewingDirection: Vector,
  reflectedVector: Vector,
  material: Material
) {
  let specularLight = Color.black();
  const reflection = reflectedVector;

  const scalarVals = reflection.dotProduct(viewingDirection) ** material.ke;

  const tmpColor = light.intensity;

  const finalColor = tmpColor.scalarMultiply(scalarVals);

  specularLight = specularLight.add(finalColor);
  return specularLight.scalarMultiply(material.ks);
}
