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
      new Vector(0.0, 0.0, 0.0)
    );
    this.lights = [
      new Light(
        'point',
        new Vector(-50.0, 20.0, 5.0),
        new Color(0.4, 1.0, 0.8),
        3
      ),
      new Light(
        'point',
        new Vector(100.0, 30.0, -15.0),
        new Color(0.6, 0.2, 0.0),
        3
      ),
      new Light(
        'point',
        new Vector(50.0, 45.0, -60.0),
        new Color(0.69, 0.21, 0.73),
        5
      ),
      // new Light(
      //   'point',
      //   new Vector(200.0, 30.0, 65.0),
      //   new Color(0.43, 0.86, 0.59),
      //   7
      // ),
    ];

    this.objects = [
      new Plane(
        new Vector(0.0, 1.0, 0.0),
        new Material(Color.white(), 0.4, 0.2, 2, 0.25)
      ),
      new Sphere(
        new Vector(1.0, 3.0, -0.5),
        2.0,
        new Material(new Color(0.65, 0.77, 0.97), 0.1, 0.9, 20, 0.35)
      ),
      new Sphere(
        new Vector(-4.0, 0.5, 1.5),
        2.0,
        new Material(new Color(0.69, 0.28, 0.73), 0.4, 0.6, 100, 0.001)
      ),
    ];
  }
}
