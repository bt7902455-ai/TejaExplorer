import React, { useEffect, useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PilotCharacter3D from './PilotCharacter3D';

const DEFAULT_BOUNDS = {
  radius: 110,
  minY: 0,
  maxY: 5,
};

const Spaceship = ({
  onSectionChange,
  sections,
  onPositionUpdate,
  onOrientationUpdate,
  selectedCharacter = 'nova',
  virtualControlsRef,
  controlsEnabled = true,
  bounds = DEFAULT_BOUNDS,
}) => {
  const meshRef = useRef();
  const bodyRef = useRef();
  const keysRef = useRef({
    w: false,
    s: false,
    a: false,
    d: false,
    space: false,
    shift: false,
  });
  const controlsEnabledRef = useRef(controlsEnabled);
  const orientationRef = useRef({ yaw: 0, pitch: 0 });
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const directionRef = useRef(new THREE.Vector3());
  const worldDirectionRef = useRef(new THREE.Vector3());
  const positionRef = useRef(new THREE.Vector3());
  const rotationQuaternionRef = useRef(new THREE.Quaternion());
  const movementQuaternionRef = useRef(new THREE.Quaternion());
  const rotationEulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const movementEulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const [isBoosting, setIsBoosting] = useState(false);
  const boostingRef = useRef(false);

  const speed = 0.12;
  const damping = 0.92;
  const mouseSensitivity = 0.0023;
  const maxPitch = Math.PI * 0.42;
  const setBoostingIfChanged = (value) => {
    if (boostingRef.current === value) return;
    boostingRef.current = value;
    setIsBoosting(value);
  };

  useEffect(() => {
    controlsEnabledRef.current = controlsEnabled;
  }, [controlsEnabled]);

  useEffect(() => {
    const setKey = (event, value) => {
      const key = event.key.toLowerCase();
      const keys = keysRef.current;

      if (key in keys) {
        keys[key] = value;
      }
      if (event.key === ' ') {
        keys.space = value;
      }
      if (event.key === 'Shift') {
        keys.shift = value;
      }
    };

    const handleKeyDown = (event) => {
      setKey(event, true);
      setBoostingIfChanged(keysRef.current.w);
    };

    const handleKeyUp = (event) => {
      setKey(event, false);
      setBoostingIfChanged(keysRef.current.w);
    };

    const canvas = document.querySelector('canvas');
    const handleMouseMove = (event) => {
      if (!controlsEnabledRef.current || !canvas || document.pointerLockElement !== canvas) return;

      orientationRef.current.yaw -= event.movementX * mouseSensitivity;
      orientationRef.current.pitch = THREE.MathUtils.clamp(
        orientationRef.current.pitch - event.movementY * mouseSensitivity,
        -maxPitch,
        maxPitch
      );
    };

    const handleCanvasClick = () => {
      if (!canvas || document.pointerLockElement === canvas) return;
      canvas.requestPointerLock?.();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    canvas?.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas?.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  useEffect(() => {
    if (controlsEnabled) return;
    const canvas = document.querySelector('canvas');
    if (canvas && document.pointerLockElement === canvas) {
      document.exitPointerLock?.();
    }
  }, [controlsEnabled]);

  useFrame(() => {
    if (!meshRef.current || !bodyRef.current) return;

    const body = bodyRef.current;
    const keys = keysRef.current;
    const direction = directionRef.current;
    const worldDirection = worldDirectionRef.current;
    const velocity = velocityRef.current;
    const rotationQuaternion = rotationQuaternionRef.current;
    const movementQuaternion = movementQuaternionRef.current;
    const rotationEuler = rotationEulerRef.current;
    const movementEuler = movementEulerRef.current;
    const bodyPosition = body.translation();
    const { yaw, pitch } = orientationRef.current;
    const virtualControls = virtualControlsRef?.current ?? { x: 0, y: 0, up: false, down: false };

    if (!controlsEnabled) {
      velocity.multiplyScalar(0.8);
      const heldPosition = positionRef.current.set(bodyPosition.x, bodyPosition.y, bodyPosition.z);
      body.setNextKinematicTranslation(heldPosition);
      onPositionUpdate?.(heldPosition);
      onOrientationUpdate?.(orientationRef.current);
      return;
    }

    rotationEuler.set(pitch, yaw, 0);
    rotationQuaternion.setFromEuler(rotationEuler);
    body.setNextKinematicRotation(rotationQuaternion);

    movementEuler.set(0, yaw, 0);
    movementQuaternion.setFromEuler(movementEuler);

    direction.set(0, 0, 0);
    if (keys.w) direction.z -= speed;
    if (keys.s) direction.z += speed;
    if (keys.a) direction.x -= speed;
    if (keys.d) direction.x += speed;
    if (keys.space) direction.y += speed * 0.8;
    if (keys.shift) direction.y -= speed * 0.8;
    if (Math.abs(virtualControls.y) > 0.02) direction.z -= virtualControls.y * speed;
    if (Math.abs(virtualControls.x) > 0.02) direction.x += virtualControls.x * speed;
    if (virtualControls.up) direction.y += speed * 0.8;
    if (virtualControls.down) direction.y -= speed * 0.8;

    velocity.multiplyScalar(damping);

    if (direction.lengthSq() > 0) {
      worldDirection.copy(direction).applyQuaternion(movementQuaternion);
      velocity.add(worldDirection);
    }

    const newPosition = positionRef.current.set(
      bodyPosition.x + velocity.x,
      bodyPosition.y + velocity.y,
      bodyPosition.z + velocity.z
    );

    const horizontalDistance = Math.hypot(newPosition.x, newPosition.z);
    if (horizontalDistance > bounds.radius) {
      const clampScale = bounds.radius / horizontalDistance;
      newPosition.x *= clampScale;
      newPosition.z *= clampScale;
      velocity.x *= 0.25;
      velocity.z *= 0.25;
    }

    newPosition.y = THREE.MathUtils.clamp(newPosition.y, bounds.minY, bounds.maxY);

    if (newPosition.y <= bounds.minY || newPosition.y >= bounds.maxY) velocity.y = 0;

    body.setNextKinematicTranslation(newPosition);
    onPositionUpdate?.(newPosition);
    onOrientationUpdate?.(orientationRef.current);
    checkSectionProximity(newPosition, sections, onSectionChange);
    setBoostingIfChanged(keys.w || virtualControls.y > 0.3);
  });

  const checkSectionProximity = (position, allSections, callback) => {
    const proximityThreshold = 18;

    for (const section of allSections) {
      const dx = position.x - section.position[0];
      const dz = position.z - section.position[2];
      const dy = Math.abs(position.y - section.position[1]);
      const horizontalDistance = Math.hypot(dx, dz);

      if (horizontalDistance < proximityThreshold && dy < 10) {
        callback(section.id);
        return;
      }
    }

    callback(null);
  };

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      position={[0, 2, -20]}
      rotation={[0, 0, 0]}
    >
      <group ref={meshRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 0.5, 3]} />
          <meshStandardMaterial color="#00ffff" emissive="#008080" emissiveIntensity={0.35} />
        </mesh>

        <mesh position={[0, 0.2, 1]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#87CEEB" emissive="#4A90E2" emissiveIntensity={0.35} transparent opacity={0.62} />
        </mesh>

        <group position={[0, -0.18, 1.03]} scale={[0.27, 0.27, 0.27]}>
          <PilotCharacter3D variant={selectedCharacter} animate />
        </group>

        <mesh position={[-1.5, -0.2, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[1.5, 0.1, 0.5]} />
          <meshStandardMaterial color="#ff00ff" emissive="#800080" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[1.5, -0.2, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[1.5, 0.1, 0.5]} />
          <meshStandardMaterial color="#ff00ff" emissive="#800080" emissiveIntensity={0.2} />
        </mesh>

        <pointLight position={[0, 0, -1.5]} intensity={2} color="#00ffff" distance={8} decay={2} />
        <mesh position={[0, 0, -1.5]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
        </mesh>

        {isBoosting && (
          <mesh position={[0, 0, -2.5]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color="#ff00ff" transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
};

export default Spaceship;
