import React from 'react';
import Controls from './components/Controls';
import { Canvas } from './GlobalStyles';
import MainScene from './views/MainScene';

function App() {
  return (
    <>
      <Canvas>
        <MainScene />
        <Controls />
      </Canvas>
    </>
  );
}

export default App;
