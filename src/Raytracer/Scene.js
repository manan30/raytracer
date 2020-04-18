import Camera from './Camera';
import Vector from './Vector';
import Light from './Light';
import Color from './Color';
import Plane from './Plane';
import Sphere from './Sphere';
import Material from './Material';

export default class Scene {
  constructor() {
    this.camera = new Camera(
      new Vector(3.0, -5.0, 30.0),
      new Vector(0.0, 0.0, 0.0),
      60,
      2056 / 2056
    );
    this.lights = [
      new Light('ambient', undefined, 0.2),
      new Light('point', new Vector(2.0, 1.0, 0.0), 0.6),
      new Light('directional', new Vector(1.0, 4.0, 4.0), 0.2),
    ];
    this.objects = [
      new Plane(
        new Vector(0.0, 1.0, 0.0),
        new Material(new Color(0.9, 0.9, 0.9), undefined, 0.0, 0.0)
      ),
      new Sphere(
        new Vector(0.0, 1.0, -0.25),
        2.0,
        new Material(new Color(0.65, 0.77, 0.97), undefined, 1.0, 0.0)
      ),
      new Sphere(
        new Vector(-4.0, 0.5, 1.5),
        1.5,
        new Material(new Color(0.6, 0.2, 0.0), undefined, 1.0, 0.0)
      ),
    ];
  }
}
