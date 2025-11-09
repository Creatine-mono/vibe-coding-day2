import { useMemo } from 'react';
import * as THREE from 'three';

interface CloudProps {
  position: [number, number, number];
  scale: number;
}

function Cloud({ position, scale }: CloudProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
      <mesh position={[0.8, 0.2, 0]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
      <mesh position={[-0.8, 0.2, 0]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.7, 8, 8]} />
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

export function Clouds() {
  const cloudData = useMemo(() => {
    const clouds: Array<{ position: [number, number, number]; scale: number; key: string }> = [];
    
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 500;
      const y = 30 + Math.random() * 40;
      const z = (Math.random() - 0.5) * 500;
      const scale = 3 + Math.random() * 4;
      
      clouds.push({
        position: [x, y, z],
        scale,
        key: `cloud-${i}`
      });
    }
    
    return clouds;
  }, []);

  return (
    <>
      {cloudData.map((cloud) => (
        <Cloud key={cloud.key} position={cloud.position} scale={cloud.scale} />
      ))}
    </>
  );
}
