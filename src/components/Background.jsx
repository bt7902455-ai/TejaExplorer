import React from 'react';
import { Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Background = () => {
  return (
    <>
      {/* Starfield */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />

      {/* Nebulae background */}
      <Sphere radius={200} position={[0, 0, 0]} scale={[1, 1, 1]}>
        <meshBasicMaterial 
          attach="material" 
          color="#0a0a1a" 
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Nebula 1 - Blue */}
      <Sphere radius={180} position={[-80, 40, -80]} scale={[0.8, 0.6, 0.8]}>
        <meshBasicMaterial 
          attach="material" 
          color="#00ffff" 
          opacity={0.15} 
          transparent
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Nebula 2 - Pink */}
      <Sphere radius={150} position={[60, -30, 60]} scale={[0.7, 0.8, 0.7]}>
        <meshBasicMaterial 
          attach="material" 
          color="#ff00ff" 
          opacity={0.12} 
          transparent
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Nebula 3 - Purple */}
      <Sphere radius={160} position={[0, -50, -100]} scale={[0.9, 0.5, 0.9]}>
        <meshBasicMaterial 
          attach="material" 
          color="#8B00FF" 
          opacity={0.1} 
          transparent
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Space fog */}
      <fog attach="fog" args={['#0a0a1a', 50, 300]} />
    </>
  );
};

export default Background;
