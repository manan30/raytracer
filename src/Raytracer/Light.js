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

export function getAmbientLight(surfaceColor: Color, lights: Array<Light>) {
  const comp = 1 / lights.length;
  let ambientColor = Color.black();

  for (let i = 0; i < lights.length; i += 1) {
    ambientColor = ambientColor.add(lights[i].intensity.scalarMultiply(comp));
  }

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

  const tmpColor = light.color;
  const objectColor = material.surfaceColor;

  const finalColor = tmpColor.multiply(objectColor).scalarMultiply(scalarVals);

  diffuseLight = diffuseLight.add(finalColor);

  return diffuseLight.scalarMultiply(material.kd);
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
