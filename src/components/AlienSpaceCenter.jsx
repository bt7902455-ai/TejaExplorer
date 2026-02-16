import React, { useMemo } from 'react';
import * as THREE from 'three';

const AlienSpaceCenter = ({ bounds }) => {
  const perimeterRadius = bounds.radius;
  const floorRadius = perimeterRadius + 28;
  const domeRadius = perimeterRadius + 52;
  const floorY = bounds.minY - 1.2;

  const pylons = useMemo(() => {
    return Array.from({ length: 18 }, (_, index) => {
      const angle = (index / 18) * Math.PI * 2;
      return {
        angle,
        x: Math.cos(angle) * (perimeterRadius + 10),
        z: Math.sin(angle) * (perimeterRadius + 10),
      };
    });
  }, [perimeterRadius]);

  return (
    <group>
      {/* Main platform floor */}
      <mesh position={[0, floorY, 0]} receiveShadow>
        <cylinderGeometry args={[floorRadius, floorRadius, 2.4, 84]} />
        <meshStandardMaterial color="#0a1224" emissive="#123554" emissiveIntensity={0.24} />
      </mesh>

      {/* Runway/glow rings */}
      <mesh position={[0, bounds.minY + 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[perimeterRadius - 10, perimeterRadius - 6, 128]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, bounds.minY + 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[perimeterRadius + 9, perimeterRadius + 13, 128]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, bounds.minY + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[28, 30, 96]} />
        <meshBasicMaterial color="#5ee7ff" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Dome shell */}
      <mesh position={[0, floorY - 1.2, 0]}>
        <sphereGeometry args={[domeRadius, 84, 64, 0, Math.PI * 2, 0, Math.PI * 0.95]} />
        <meshStandardMaterial
          color="#102236"
          emissive="#18496f"
          emissiveIntensity={0.2}
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          roughness={0.9}
          metalness={0.2}
        />
      </mesh>

      {/* Dome structural rings */}
      <mesh position={[0, floorY + 28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[perimeterRadius + 20, 1.2, 24, 180]} />
        <meshStandardMaterial color="#2fc7ff" emissive="#2fc7ff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, floorY + 28, 0]} rotation={[Math.PI / 2, Math.PI / 3, 0]}>
        <torusGeometry args={[perimeterRadius + 20, 0.85, 20, 180]} />
        <meshStandardMaterial color="#79f3ff" emissive="#79f3ff" emissiveIntensity={0.36} />
      </mesh>
      <mesh position={[0, floorY + 28, 0]} rotation={[Math.PI / 2, -Math.PI / 3, 0]}>
        <torusGeometry args={[perimeterRadius + 20, 0.85, 20, 180]} />
        <meshStandardMaterial color="#79f3ff" emissive="#79f3ff" emissiveIntensity={0.36} />
      </mesh>

      {/* Central command halo */}
      <mesh position={[0, floorY + 33, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[20, 1.8, 24, 120]} />
        <meshStandardMaterial color="#6ae6ff" emissive="#6ae6ff" emissiveIntensity={0.8} />
      </mesh>
      <pointLight position={[0, floorY + 33, 0]} color="#6ae6ff" intensity={1.3} distance={90} />

      {/* Perimeter pylons */}
      {pylons.map((pylon) => (
        <group key={pylon.angle} position={[pylon.x, floorY + 9, pylon.z]} rotation={[0, pylon.angle, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.2, 18, 2.2]} />
            <meshStandardMaterial color="#14243b" emissive="#1d4464" emissiveIntensity={0.25} metalness={0.3} roughness={0.6} />
          </mesh>
          <mesh position={[0, 8.6, 0]}>
            <boxGeometry args={[3.6, 1.1, 3.6]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.9} />
          </mesh>
          <pointLight position={[0, 8.8, 0]} color="#38bdf8" intensity={0.35} distance={26} />
        </group>
      ))}

      {/* Ground grid to add orientation and avoid empty-space feel */}
      <gridHelper args={[floorRadius * 1.7, 70, '#40d8ff', '#143853']} position={[0, bounds.minY + 0.03, 0]} />
    </group>
  );
};

export default AlienSpaceCenter;
