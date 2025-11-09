import * as THREE from 'three';

export function Environment() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#4a9b4f" side={THREE.DoubleSide} />
      </mesh>

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[50, 100, 50]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
    </>
  );
}
