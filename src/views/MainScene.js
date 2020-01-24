import React, { useEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import { PointLightHelper } from 'three';

function MainScene() {
  const { camera, scene } = useThree();
  const lightRef = useRef();

  camera.position.set(0, 50, 300);

  useEffect(() => {
    if (lightRef.current) {
      const helper = new PointLightHelper(lightRef.current, 10, 0x00ff00);
      scene.add(helper);
    }
  }, [scene]);

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

export default MainScene;
