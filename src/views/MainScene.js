import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import RayTracer from '../Raytracer';

function MainScene({ canvasRef }) {
  const { camera, scene, gl } = useThree();
  const lightRef = useRef();

  camera.position.set(0, 50, 300);
  gl.setSize(window.innerWidth / 2, window.innerHeight);

  useEffect(() => {
    if (lightRef.current) {
      // const helper = new PointLightHelper(lightRef.current, 10, 0x00ff00);
      // scene.add(helper);
    }

    camera.lookAt(0, 0, 0);
    scene.children.forEach(obj => camera.worldToLocal(obj.position));
  }, [camera, scene]);

  useEffect(() => {
    const { current: ele } = canvasRef;
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.width = 2056;
    canvas.height = 2056;
    ele.appendChild(canvas);
    const context = canvas.getContext('2d');
    const rayTracer = new RayTracer(canvas.width, canvas.height, context);
    rayTracer.render();
  }, [canvasRef, scene]);

  return (
    <>
      <ambientLight attach='light' intensity={0.5} />

      <pointLight
        ref={lightRef}
        attach='light'
        args={[0xffffff, 1, 600]}
        position={[200, 250, 0]}
      />
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeBufferGeometry attach='geometry' args={[1000, 1000]} />
        <meshStandardMaterial attach='material' />
      </mesh>

      <mesh position={[0, 70, 0]} castShadow receiveShadow>
        <sphereBufferGeometry attach='geometry' args={[50, 360, 360]} />
        <meshStandardMaterial attach='material' color={0xaa3300} />
      </mesh>

      <mesh position={[120, 120, 0]} castShadow receiveShadow>
        <sphereBufferGeometry attach='geometry' args={[50, 360, 360]} />
        <meshStandardMaterial attach='material' color={0x77ffcc} />
      </mesh>
    </>
  );
}

MainScene.propTypes = {
  canvasRef: PropTypes.objectOf(PropTypes.any).isRequired
};

export default MainScene;
