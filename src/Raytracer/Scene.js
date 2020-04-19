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
      1.0
    );
    this.lights = [
      new Light(
        'point',
        new Vector(5.0, 2.0, 1.0),
        new Color(0.49, 0.07, 0.07),
        5
      ),
      new Light(
        'point',
        new Vector(1.5, 2.5, 1.5),
        new Color(0.07, 0.07, 0.49),
        5
      ),
      new Light(
        'point',
        new Vector(1.5, 2.5, -1.5),
        new Color(0.07, 0.49, 0.071),
        6
      ),
      new Light(
        'point',
        new Vector(5.0, 3.5, 5.0),
        new Color(0.21, 0.21, 0.35),
        2
      ),
    ];

    this.objects = [
      new Plane(
        new Vector(0.0, 1.0, 0.0),
        new Material(
          Color.white(),
          Color.grey(),
          0.4,
          Color.white(),
          1.0,
          Color.white(),
          0.0
        )
      ),
      new Sphere(
        new Vector(0.0, 1.0, -0.25),
        2.0,
        new Material(
          new Color(0.65, 0.77, 0.97),
          Color.grey(),
          0.4,
          Color.white(),
          0.2,
          Color.white(),
          0.8
        )
      ),
      new Sphere(
        new Vector(-4.0, 0.5, 1.5),
        1.5,
        new Material(
          new Color(0.69, 0.28, 0.73),
          Color.grey(),
          0.4,
          Color.white(),
          0.4,
          Color.white(),
          0.6
        )
      ),
    ];
  }
}
