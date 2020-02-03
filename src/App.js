import React from 'react';
import { Canvas, RayTracedCanvas } from './GlobalStyles';
import MainScene from './views/MainScene';

function App() {
  const canvasRef = React.useRef();

  return (
    <>
      <Canvas>
        <MainScene canvas={canvasRef} />
        {/* <Controls /> */}
      </Canvas>
      <RayTracedCanvas ref={canvasRef} />
      {/* <div className='content'>
        Green Sphere
        <br />
        Position - x: 120, y: 120, z: 0
        <br />
        Size - 50
        <br />
        <br />
        Red Sphere
        <br />
        Position - x: 0, y: 70, z: 0
        <br />
        Size - 50
        <br />
        <br />
        Pointlight
        <br />
        Position - x: 200, y: 250, z: 0
        <br />
        <br />
        Camera
        <br />
        Position - x: 0, y: 50, z: 300
        <br />
        LookAt - x: 0, y: 0, z: 0
      </div> */}
    </>
  );
}

export default App;
