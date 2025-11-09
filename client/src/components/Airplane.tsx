import { useRef } from 'react';
import * as THREE from 'three';

export function Airplane() {
  const airplaneRef = useRef<THREE.Group>(null);

  return (
    <group ref={airplaneRef}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#ff3333" />
      </mesh>

      <mesh position={[-2, 0, 0]} castShadow>
        <boxGeometry args={[3, 0.1, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[2, 0, 0]} castShadow>
        <boxGeometry args={[3, 0.1, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[-1.2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[1.5, 0, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}
