import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Airplane } from './Airplane';
import { useFlightData } from '../lib/stores/useFlightData';

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  speedUp = 'speedUp',
  speedDown = 'speedDown',
  loop = 'loop',
  barrelRoll = 'barrelRoll',
  reverse = 'reverse',
}

export function Game() {
  const airplaneGroupRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const rotationSpeedRef = useRef({ pitch: 0, roll: 0 });
  const [flightSpeed, setFlightSpeed] = useState(20);
  const [altitude, setAltitude] = useState(20);
  const maneuverStateRef = useRef<{ type: string | null; progress: number }>({ type: null, progress: 0 });
  const engineSoundRef = useRef<HTMLAudioElement | null>(null);
  const windSoundRef = useRef<HTMLAudioElement | null>(null);
  const { camera } = useThree();
  const { setSpeed, setAltitude: setGlobalAltitude } = useFlightData();

  const [, getKeys] = useKeyboardControls<Controls>();

  useEffect(() => {
    camera.position.set(0, 10, -30);
    camera.lookAt(0, 0, 0);

    const engineSound = new Audio('/sounds/background.mp3');
    engineSound.loop = true;
    engineSound.volume = 0.3;
    engineSound.play().catch(() => console.log('Audio autoplay blocked'));
    engineSoundRef.current = engineSound;

    return () => {
      engineSound.pause();
      engineSound.src = '';
    };
  }, [camera]);

  useFrame((state, delta) => {
    if (!airplaneGroupRef.current) return;

    const controls = getKeys();
    const airplane = airplaneGroupRef.current;

    if (controls.speedUp && flightSpeed < 50) {
      setFlightSpeed(prev => Math.min(prev + 0.5, 50));
    }
    if (controls.speedDown && flightSpeed > 5) {
      setFlightSpeed(prev => Math.max(prev - 0.5, 5));
    }

    if (controls.loop && maneuverStateRef.current.type === null) {
      maneuverStateRef.current = { type: 'loop', progress: 0 };
    }
    if (controls.barrelRoll && maneuverStateRef.current.type === null) {
      maneuverStateRef.current = { type: 'barrelRoll', progress: 0 };
    }
    if (controls.reverse && maneuverStateRef.current.type === null) {
      maneuverStateRef.current = { type: 'reverse', progress: 0 };
    }

    if (maneuverStateRef.current.type === 'loop') {
      const loopSpeed = 2.5;
      maneuverStateRef.current.progress += delta * loopSpeed;

      const rotationStep = delta * loopSpeed * Math.PI * 2;
      const pitchAxis = new THREE.Vector3(1, 0, 0);
      pitchAxis.applyQuaternion(airplane.quaternion);
      const loopQuat = new THREE.Quaternion().setFromAxisAngle(pitchAxis, rotationStep);
      airplane.quaternion.multiply(loopQuat);

      if (maneuverStateRef.current.progress >= 1) {
        maneuverStateRef.current = { type: null, progress: 0 };
      }
    } else if (maneuverStateRef.current.type === 'barrelRoll') {
      const rollSpeed = 3;
      maneuverStateRef.current.progress += delta * rollSpeed;

      const rotationStep = delta * rollSpeed * Math.PI * 2;
      const rollAxis = new THREE.Vector3(0, 0, 1);
      rollAxis.applyQuaternion(airplane.quaternion);
      const rollQuat = new THREE.Quaternion().setFromAxisAngle(rollAxis, rotationStep);
      airplane.quaternion.multiply(rollQuat);

      if (maneuverStateRef.current.progress >= 1) {
        maneuverStateRef.current = { type: null, progress: 0 };
      }
    } else if (maneuverStateRef.current.type === 'reverse') {
      const reverseSpeed = 2;
      maneuverStateRef.current.progress += delta * reverseSpeed;

      // 180도 회전 (Y축 기준)
      const rotationStep = delta * reverseSpeed * Math.PI;
      const yawAxis = new THREE.Vector3(0, 1, 0);
      const reverseQuat = new THREE.Quaternion().setFromAxisAngle(yawAxis, rotationStep);
      airplane.quaternion.multiply(reverseQuat);

      if (maneuverStateRef.current.progress >= 1) {
        maneuverStateRef.current = { type: null, progress: 0 };
      }
    } else {
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

      const localXAxis = new THREE.Vector3(1, 0, 0);
      localXAxis.applyQuaternion(airplane.quaternion);
      const pitchQuat = new THREE.Quaternion().setFromAxisAngle(localXAxis, rotationSpeedRef.current.pitch * delta);
      
      const localZAxis = new THREE.Vector3(0, 0, 1);
      localZAxis.applyQuaternion(airplane.quaternion);
      const rollQuat = new THREE.Quaternion().setFromAxisAngle(localZAxis, rotationSpeedRef.current.roll * delta);
      
      airplane.quaternion.multiply(pitchQuat);
      airplane.quaternion.multiply(rollQuat);
    }

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(airplane.quaternion);
    forward.multiplyScalar(flightSpeed * delta);

    airplane.position.add(forward);

    const minAltitude = 2;
    const maxAltitude = 150;
    
    if (airplane.position.y < minAltitude) {
      airplane.position.y = minAltitude;
      if (airplane.rotation.x > 0) {
        airplane.rotation.x *= 0.9;
      }
    }
    
    if (airplane.position.y > maxAltitude) {
      airplane.position.y = maxAltitude;
      if (airplane.rotation.x < 0) {
        airplane.rotation.x *= 0.9;
      }
    }

    setAltitude(airplane.position.y);
    setGlobalAltitude(airplane.position.y);
    setSpeed(flightSpeed);

    const cameraOffset = new THREE.Vector3(0, 10, -30);
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
