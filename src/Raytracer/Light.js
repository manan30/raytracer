// @ts-check

import Vector from './Vector';
import Color from './Color';
import Material from './Material';

export default class Light {
  constructor(position: Vector, color: Color, intensity: Number) {
    this.position = position;
    this.color = color;
    this.intensity = intensity;
  }
}

/**
 * @function getAmbientLight
 * @param  {Color} surfaceColor: Color  {description}
 * @param  {Light []} lights: Array<Light> {description}
 * @return {Color} {description}
 */
export function getAmbientLight(surfaceColor: Color, lights: Array<Light>) {
  const scaleFactor = 1 / lights.length;
  let ambientColor = Color.black();
  const whiteColor = Color.white();

  for (let i = 0; i < lights.length; i += 1) {
    ambientColor = ambientColor.add(whiteColor.scalarMultiply(scaleFactor));
  }

  return ambientColor.multiply(surfaceColor).scalarMultiply(0.2);
}

export function getDiffuseLight(
  incomingLightDirection: Vector,
  light: Light,
  intersectionPoint: Vector,
  normal: Vector,
  materialColor: Color,
  kd: Number
) {
  let diffuseLight = Color.black();

  const scalarVals = incomingLightDirection.dotProduct(normal);

  const tmpColor = light.color;

  const objectColor = materialColor;

  const finalColor = tmpColor.multiply(objectColor).scalarMultiply(scalarVals);

  diffuseLight = diffuseLight.add(finalColor);

  return diffuseLight.scalarMultiply(kd).scalarMultiply(light.intensity);
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

  const tmpColor = light.color;

  const finalColor = tmpColor.scalarMultiply(scalarVals);

  specularLight = specularLight.add(finalColor);
  return specularLight
    .scalarMultiply(material.ks)
    .scalarMultiply(light.intensity);
}
