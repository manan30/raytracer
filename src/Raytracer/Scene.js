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
      75
    );
    this.lights = [
      new Light(new Vector(-5.0, 5.0, 5.0), new Color(0.4, 1.0, 0.8)),
      new Light(new Vector(10.0, 5.0, -5.0), new Color(0.6, 0.2, 0.0)),
    ];
    this.objects = [
      new Plane(
        'plane',
        new Vector(0.0, 1.0, 0.0),
        new Color(0.9, 0.9, 0.9),
        new Material(
          (pos) => {
            if ((Math.floor(pos.z) + Math.floor(pos.x)) % 2 !== 0) {
              return Color.white();
            }
            return Color.black();
          },
          Color.white(),
          false,
          0.0,
          150
        )
      ),
      new Sphere(
        'sphere',
        new Vector(0.0, 1.0, -0.25),
        2.0,
        new Color(0.4, 1.0, 0.8),
        new Material(() => Color.white(), Color.grey(), true, 0.7, 250)
      ),
      new Sphere(
        'sphere',
        new Vector(-3.0, 0.5, 1.5),
        1.5,
        new Color(0.6, 0.2, 0.0),
        new Material(() => Color.white(), Color.grey(), true, 0.0, 250)
      ),
    ];
  }
}
