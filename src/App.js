import React from 'react';
import { Canvas, RayTracedCanvas } from './GlobalStyles';
import MainScene from './views/MainScene';
// import Controls from './components/Controls';

function App() {
  const canvasRef = React.useRef();

  return (
    <div style={{ display: 'inline-flex', height: '100%', width: '100%' }}>
      <Canvas>
        <MainScene canvasRef={canvasRef} />
        {/* <Controls /> */}
      </Canvas>
      <div style={{ width: '50%' }}>
        <RayTracedCanvas ref={canvasRef} />
      </div>
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
    </div>
  );
}

export default App;
