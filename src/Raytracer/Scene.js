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
      new Light(new Vector(-5.0, 5.0, 5.0), new Color(0.62, 0.44, 0.21), 10),
      // new Light(
      //   new Vector(10.0, 5.0, -5.0),
      //   new Color(0.39, 0.64, 0.34),
      //   Color.white()
      // ),
      // new Light(
      //   new Vector(7.5, 10.0, -7.5),
      //   new Color(0.55, 0.72, 0.43),
      //   Color.white()
      // ),
    ];

    this.objects = [
      new Plane(
        new Vector(0.0, 1.0, 0.0),
        new Material(
          (pos) =>
            (Math.floor(pos.z) + Math.floor(pos.x)) % 2 !== 0
              ? Color.white()
              : Color.black(),
          0.4,
          0.0,
          1.0
        )
      ),
      new Sphere(
        new Vector(0.0, 1.0, -0.25),
        2.0,
        new Material(new Color(0.65, 0.77, 0.97), 0.1, 0.9, 20, 0.6)
      ),
      new Sphere(
        new Vector(-4.0, 0.5, 1.5),
        2.0,
        new Material(Color.white(), 0.4, 0.6, 100, 0.0, 0.8, 0.95)
      ),
    ];
  }
}
