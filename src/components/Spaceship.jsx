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
  const mainThrusterRef = useRef();
  const leftThrusterRef = useRef();
  const rightThrusterRef = useRef();
  const antiGravRef = useRef();
  const boostFlareRef = useRef();

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

  useFrame((state) => {
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

    const t = state.clock.getElapsedTime();
    const idlePulse = 1 + Math.sin(t * 8) * 0.08;
    const boostPulse = boostingRef.current ? 1.22 : 1;
    const pulse = idlePulse * boostPulse;

    if (mainThrusterRef.current) {
      mainThrusterRef.current.scale.setScalar(pulse);
      mainThrusterRef.current.material.opacity = boostingRef.current ? 0.95 : 0.72;
    }
    if (leftThrusterRef.current) {
      leftThrusterRef.current.scale.setScalar(0.95 + Math.sin(t * 7 + 1.4) * 0.06);
    }
    if (rightThrusterRef.current) {
      rightThrusterRef.current.scale.setScalar(0.95 + Math.sin(t * 7 + 2.6) * 0.06);
    }
    if (antiGravRef.current) {
      antiGravRef.current.rotation.z += 0.006;
    }
    if (boostFlareRef.current) {
      boostFlareRef.current.scale.set(1, 1, 1 + Math.sin(t * 18) * 0.12);
    }
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
        <group rotation={[0, Math.PI, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.03, 0.04]}>
            <capsuleGeometry args={[0.74, 2.55, 12, 24]} />
            <meshStandardMaterial
              color="#67e8f9"
              emissive="#0c4a6e"
              emissiveIntensity={0.34}
              metalness={0.68}
              roughness={0.24}
            />
          </mesh>

          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.28, 0.18]}>
            <capsuleGeometry args={[0.56, 1.95, 10, 18]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#0e7490"
              emissiveIntensity={0.2}
              metalness={0.52}
              roughness={0.35}
            />
          </mesh>

          <mesh position={[0, -0.04, -1.72]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.34, 1.02, 28]} />
            <meshStandardMaterial color="#bae6fd" emissive="#164e63" emissiveIntensity={0.2} metalness={0.64} roughness={0.28} />
          </mesh>

          <mesh position={[0, 0.56, -0.15]}>
            <boxGeometry args={[0.17, 0.35, 1.55]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.32} metalness={0.45} roughness={0.3} />
          </mesh>

          <mesh position={[-1.15, -0.09, -0.08]} rotation={[0, 0, 0.28]}>
            <boxGeometry args={[1.54, 0.14, 1.08]} />
            <meshStandardMaterial color="#312e81" emissive="#4c1d95" emissiveIntensity={0.36} metalness={0.42} roughness={0.28} />
          </mesh>
          <mesh position={[1.15, -0.09, -0.08]} rotation={[0, 0, -0.28]}>
            <boxGeometry args={[1.54, 0.14, 1.08]} />
            <meshStandardMaterial color="#312e81" emissive="#4c1d95" emissiveIntensity={0.36} metalness={0.42} roughness={0.28} />
          </mesh>

          <mesh position={[-1.65, -0.03, 0.15]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.52, 0.09, 0.34]} />
            <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={0.3} metalness={0.42} roughness={0.26} />
          </mesh>
          <mesh position={[1.65, -0.03, 0.15]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.52, 0.09, 0.34]} />
            <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={0.3} metalness={0.42} roughness={0.26} />
          </mesh>

          <mesh position={[0, 0.14, -0.53]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.58, 0.07, 16, 42]} />
            <meshStandardMaterial color="#38bdf8" emissive="#67e8f9" emissiveIntensity={0.46} metalness={0.3} roughness={0.24} />
          </mesh>

          <mesh position={[0, 0.35, -0.56]}>
            <sphereGeometry args={[0.63, 32, 32]} />
            <meshPhysicalMaterial
              color="#93c5fd"
              emissive="#22d3ee"
              emissiveIntensity={0.24}
              transparent
              opacity={0.38}
              roughness={0.08}
              metalness={0.04}
              clearcoat={1}
              clearcoatRoughness={0.12}
              transmission={0.88}
            />
          </mesh>

          <mesh position={[0, -0.18, -0.5]}>
            <boxGeometry args={[0.45, 0.28, 0.42]} />
            <meshStandardMaterial color="#0f172a" metalness={0.35} roughness={0.42} />
          </mesh>

          <group position={[0, -0.06, -0.54]} scale={[0.36, 0.36, 0.36]}>
            <PilotCharacter3D variant={selectedCharacter} animate />
          </group>

          <mesh position={[0, -0.04, 1.42]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.45, 0.36, 22]} />
            <meshStandardMaterial color="#334155" emissive="#1e293b" emissiveIntensity={0.25} metalness={0.62} roughness={0.34} />
          </mesh>
          <mesh position={[-0.62, -0.07, 1.08]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.17, 0.23, 0.3, 16]} />
            <meshStandardMaterial color="#334155" emissive="#1e293b" emissiveIntensity={0.2} metalness={0.52} roughness={0.4} />
          </mesh>
          <mesh position={[0.62, -0.07, 1.08]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.17, 0.23, 0.3, 16]} />
            <meshStandardMaterial color="#334155" emissive="#1e293b" emissiveIntensity={0.2} metalness={0.52} roughness={0.4} />
          </mesh>

          <mesh ref={mainThrusterRef} position={[0, -0.04, 1.62]}>
            <sphereGeometry args={[0.47, 24, 24]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.72} depthWrite={false} />
          </mesh>
          <mesh ref={leftThrusterRef} position={[-0.62, -0.07, 1.28]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.68} depthWrite={false} />
          </mesh>
          <mesh ref={rightThrusterRef} position={[0.62, -0.07, 1.28]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.68} depthWrite={false} />
          </mesh>
          <pointLight position={[0, -0.04, 1.62]} intensity={1.85} color="#22d3ee" distance={14} decay={2} />
          <pointLight position={[0, 0.3, -0.46]} intensity={0.95} color="#67e8f9" distance={8} decay={2} />

          <group ref={antiGravRef} position={[0, -0.63, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.68, 1.28, 56]} />
              <meshBasicMaterial color="#67e8f9" transparent opacity={0.72} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
            <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.24, 0.54, 40]} />
              <meshBasicMaterial color="#22d3ee" transparent opacity={0.85} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
          </group>

          {isBoosting && (
            <group ref={boostFlareRef} position={[0, -0.04, 2.1]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.3, 1.2, 18]} />
                <meshBasicMaterial color="#67e8f9" transparent opacity={0.82} depthWrite={false} />
              </mesh>
              <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.22, 0.58, 36]} />
                <meshBasicMaterial color="#a78bfa" transparent opacity={0.7} side={THREE.DoubleSide} depthWrite={false} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </RigidBody>
  );
};

export default Spaceship;
