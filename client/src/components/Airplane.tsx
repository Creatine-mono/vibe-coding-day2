import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Airplane() {
  const airplaneRef = useRef<THREE.Group>(null);
  const propellerRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (propellerRef.current) {
      propellerRef.current.rotation.x += delta * 30;
    }
  });

  return (
    <group ref={airplaneRef}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 2]} />
        <meshStandardMaterial color="#ff3333" />
      </mesh>

      <mesh position={[0, 0, -2]} castShadow>
        <boxGeometry args={[3, 0.1, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0, 0, 2]} castShadow>
        <boxGeometry args={[3, 0.1, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0, 0.3, -1.2]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0, 0, 1.5]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      <group ref={propellerRef} position={[0, 0, 1.9]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 1.5, 0.1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.1, 1.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
    </group>
  );
}
