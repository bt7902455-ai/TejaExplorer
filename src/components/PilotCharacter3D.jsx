import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import profileImage from '../../TejaMathukumalliPictureLinkedIn.jpg';

const PRESETS = {
  nova: {
    suit: '#2563eb',
    hoodie: '#38bdf8',
    skin: '#f2c3a4',
    hair: '#2b1b12',
    shoe: '#f1f5f9',
  },
  orion: {
    suit: '#4f46e5',
    hoodie: '#a78bfa',
    skin: '#efbf9f',
    hair: '#2b1b12',
    shoe: '#e2e8f0',
  },
  sol: {
    suit: '#ca8a04',
    hoodie: '#facc15',
    skin: '#efbe99',
    hair: '#2b1b12',
    shoe: '#fef3c7',
  },
};

const PilotCharacter3D = ({ variant = 'nova', animate = true, preview = false }) => {
  const preset = PRESETS[variant] || PRESETS.nova;
  const faceTexture = useTexture(profileImage);
  const groupRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();

  useEffect(() => {
    faceTexture.colorSpace = THREE.SRGBColorSpace;
    faceTexture.minFilter = THREE.LinearFilter;
    faceTexture.magFilter = THREE.LinearFilter;
    faceTexture.needsUpdate = true;
  }, [faceTexture]);

  useFrame((state) => {
    if (!animate || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 2) * 0.035;
    groupRef.current.rotation.y = preview ? Math.sin(t * 0.85) * 0.26 : Math.sin(t * 0.35) * 0.05;

    if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 2.5) * 0.12;
    if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t * 2.5) * 0.12;
    if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.sin(t * 2.2) * 0.05;
    if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(t * 2.2) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 0.96, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color={preset.skin} roughness={0.58} />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.31, 0.9, 0]}>
        <sphereGeometry args={[0.06, 14, 14]} />
        <meshStandardMaterial color={preset.skin} />
      </mesh>
      <mesh position={[0.31, 0.9, 0]}>
        <sphereGeometry args={[0.06, 14, 14]} />
        <meshStandardMaterial color={preset.skin} />
      </mesh>

      {/* Hair cap and hair swoop */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.355, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
        <meshStandardMaterial color={preset.hair} roughness={0.45} />
      </mesh>
      <mesh position={[0.07, 1.33, 0.07]} rotation={[0.18, 0, -0.32]}>
        <coneGeometry args={[0.12, 0.32, 16]} />
        <meshStandardMaterial color={preset.hair} roughness={0.45} />
      </mesh>

      {/* Face decal */}
      <mesh position={[0, 0.95, 0.295]}>
        <circleGeometry args={[0.2, 32]} />
        <meshBasicMaterial map={faceTexture} transparent opacity={0.98} />
      </mesh>

      {/* Cartoon eyes */}
      <mesh position={[-0.09, 0.96, 0.33]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.09, 0.96, 0.33]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.09, 0.96, 0.358]}>
        <sphereGeometry args={[0.018, 10, 10]} />
        <meshStandardMaterial color="#111827" emissive="#111827" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.09, 0.96, 0.358]}>
        <sphereGeometry args={[0.018, 10, 10]} />
        <meshStandardMaterial color="#111827" emissive="#111827" emissiveIntensity={0.35} />
      </mesh>

      {/* Body/hoodie */}
      <mesh position={[0, 0.32, 0]}>
        <capsuleGeometry args={[0.22, 0.52, 10, 18]} />
        <meshStandardMaterial color={preset.suit} emissive={preset.hoodie} emissiveIntensity={0.1} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.54, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.04, 16, 40]} />
        <meshStandardMaterial color={preset.hoodie} emissive={preset.hoodie} emissiveIntensity={0.15} />
      </mesh>

      {/* Arms */}
      <group ref={leftArmRef} position={[-0.29, 0.38, 0]}>
        <mesh rotation={[0, 0, 0.22]}>
          <capsuleGeometry args={[0.065, 0.42, 8, 12]} />
          <meshStandardMaterial color={preset.suit} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.29, 0.38, 0]}>
        <mesh rotation={[0, 0, -0.22]}>
          <capsuleGeometry args={[0.065, 0.42, 8, 12]} />
          <meshStandardMaterial color={preset.suit} />
        </mesh>
      </group>

      {/* Legs */}
      <group ref={leftLegRef} position={[-0.12, -0.3, 0]}>
        <mesh>
          <capsuleGeometry args={[0.08, 0.4, 8, 12]} />
          <meshStandardMaterial color="#1f2937" roughness={0.55} />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.12, -0.3, 0]}>
        <mesh>
          <capsuleGeometry args={[0.08, 0.4, 8, 12]} />
          <meshStandardMaterial color="#1f2937" roughness={0.55} />
        </mesh>
      </group>

      {/* Shoes */}
      <mesh position={[-0.12, -0.63, 0.05]}>
        <boxGeometry args={[0.16, 0.09, 0.26]} />
        <meshStandardMaterial color={preset.shoe} roughness={0.4} />
      </mesh>
      <mesh position={[0.12, -0.63, 0.05]}>
        <boxGeometry args={[0.16, 0.09, 0.26]} />
        <meshStandardMaterial color={preset.shoe} roughness={0.4} />
      </mesh>
    </group>
  );
};

export default PilotCharacter3D;
