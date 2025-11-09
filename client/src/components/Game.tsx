import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Airplane } from './Airplane';

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
}

export function Game() {
  const airplaneGroupRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const rotationSpeedRef = useRef({ pitch: 0, roll: 0 });
  const { camera } = useThree();

  const [, getKeys] = useKeyboardControls<Controls>();

  useEffect(() => {
    camera.position.set(0, 10, -30);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((state, delta) => {
    if (!airplaneGroupRef.current) return;

    const controls = getKeys();
    const airplane = airplaneGroupRef.current;

    const pitchSpeed = 1.5;
    const rollSpeed = 2.0;
    const dampening = 0.92;

    if (controls.forward) {
      rotationSpeedRef.current.pitch += pitchSpeed * delta;
    }
    if (controls.back) {
      rotationSpeedRef.current.pitch -= pitchSpeed * delta;
    }
    if (controls.left) {
      rotationSpeedRef.current.roll += rollSpeed * delta;
    }
    if (controls.right) {
      rotationSpeedRef.current.roll -= rollSpeed * delta;
    }

    rotationSpeedRef.current.pitch *= dampening;
    rotationSpeedRef.current.roll *= dampening;

    airplane.rotation.x += rotationSpeedRef.current.pitch * delta;
    airplane.rotation.z += rotationSpeedRef.current.roll * delta;

    airplane.rotation.x = THREE.MathUtils.clamp(airplane.rotation.x, -Math.PI / 3, Math.PI / 3);
    airplane.rotation.z = THREE.MathUtils.clamp(airplane.rotation.z, -Math.PI / 2, Math.PI / 2);

    const forwardSpeed = 20;
    const forward = new THREE.Vector3(1, 0, 0);
    forward.applyQuaternion(airplane.quaternion);
    forward.multiplyScalar(forwardSpeed * delta);

    airplane.position.add(forward);

    if (airplane.position.y < 0) {
      airplane.position.y = 0;
      if (velocityRef.current.y < 0) {
        velocityRef.current.y = 0;
      }
    }

    const cameraOffset = new THREE.Vector3(-30, 10, 0);
    cameraOffset.applyQuaternion(airplane.quaternion);
    const targetCameraPosition = airplane.position.clone().add(cameraOffset);

    camera.position.lerp(targetCameraPosition, 0.1);
    camera.lookAt(airplane.position);
  });

  return (
    <group ref={airplaneGroupRef} position={[0, 20, 0]}>
      <Airplane />
    </group>
  );
}
