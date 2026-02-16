import React, { useEffect, useMemo, useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Html, Float, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import profileImage from '../../TejaMathukumalliPictureLinkedIn.jpg';

const AboutHologram = () => {
  const texture = useTexture(profileImage);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <group>
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.75, 2.2, 4.6, 28, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 2.25, 48]} />
        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.75}>
        <group position={[0, 5.6, 0]}>
          <mesh>
            <planeGeometry args={[4.3, 7.2]} />
            <meshBasicMaterial
              map={texture}
              color="#7dd3fc"
              transparent
              opacity={0.75}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          <mesh position={[0, 0, -0.04]}>
            <planeGeometry args={[4.7, 7.6]} />
            <meshBasicMaterial
              color="#22d3ee"
              transparent
              opacity={0.16}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      </Float>

      <pointLight position={[0, 5.6, 1]} intensity={0.85} color="#67e8f9" distance={20} decay={2} />
    </group>
  );
};

const EdgeBeam = ({ start, end, color, isActive, thickness = 0.14 }) => {
  const edgeData = useMemo(() => {
    const from = new THREE.Vector3(...start);
    const to = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(to, from);
    const length = direction.length();
    const midpoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );

    return {
      length,
      midpoint: [midpoint.x, midpoint.y, midpoint.z],
      quaternion,
    };
  }, [start, end]);

  return (
    <mesh position={edgeData.midpoint} quaternion={edgeData.quaternion}>
      <cylinderGeometry args={[thickness, thickness, edgeData.length, 10]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isActive ? 0.95 : 0.45}
        metalness={0.1}
        roughness={0.25}
      />
    </mesh>
  );
};

const TriangleFace = ({ a, b, c, color, isActive, opacity = 0.88 }) => {
  const geometry = useMemo(() => {
    const triangleGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([...a, ...b, ...c]);
    triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    triangleGeometry.computeVertexNormals();
    return triangleGeometry;
  }, [a, b, c]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isActive ? 0.35 : 0.2}
        transparent
        opacity={opacity}
        metalness={0.08}
        roughness={0.35}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const CheckpointDiamond = ({ isActive, y = 6.2 }) => {
  const spinRef = useRef();

  useFrame((_, delta) => {
    if (!spinRef.current) return;
    spinRef.current.rotation.y += delta * 0.45;
  });

  const points = {
    top: [0, 4.8, 0.15],
    leftTop: [-2.55, 0.85, 0.7],
    rightTop: [2.55, 0.85, 0.7],
    centerTop: [0, 1.05, -0.7],
    leftBottom: [-2.35, -0.85, -0.55],
    rightBottom: [2.35, -0.85, -0.55],
    centerBottom: [0, -1.05, 0.65],
    bottom: [0, -4.8, -0.1],
  };

  const topFaces = [
    ['top', 'leftTop', 'centerTop', '#f6de4c'],
    ['top', 'centerTop', 'rightTop', '#f6a39f'],
    ['leftTop', 'centerTop', 'rightTop', '#a8da70'],
  ];

  const bottomFaces = [
    ['bottom', 'leftBottom', 'centerBottom', '#4ec9e0'],
    ['bottom', 'centerBottom', 'rightBottom', '#5c96e8'],
    ['leftBottom', 'centerBottom', 'rightBottom', '#5bc5df'],
  ];

  const segments = [
    ['top', 'leftTop', '#f6d84b'],
    ['top', 'rightTop', '#f5a4a2'],
    ['top', 'centerTop', '#f4d63f'],
    ['leftTop', 'centerTop', '#8bd36b'],
    ['rightTop', 'centerTop', '#c690df'],

    ['leftBottom', 'bottom', '#53c7df'],
    ['rightBottom', 'bottom', '#5b95e8'],
    ['centerBottom', 'bottom', '#56c4ea'],
    ['leftBottom', 'centerBottom', '#4ec5dd'],
    ['rightBottom', 'centerBottom', '#5a92e7'],

    ['leftTop', 'leftBottom', '#f5c86f'],
    ['rightTop', 'rightBottom', '#9ec5ec'],
    ['centerTop', 'centerBottom', '#f0d95f'],
  ];

  return (
    <Float speed={2.1} rotationIntensity={0} floatIntensity={0.34}>
      <group ref={spinRef} position={[0, y, 0]} scale={isActive ? 2.15 : 1.95}>
        {topFaces.map(([a, b, c, color]) => (
          <TriangleFace
            key={`top-${a}-${b}-${c}`}
            a={points[a]}
            b={points[b]}
            c={points[c]}
            color={color}
            isActive={isActive}
          />
        ))}

        {bottomFaces.map(([a, b, c, color]) => (
          <TriangleFace
            key={`bottom-${a}-${b}-${c}`}
            a={points[a]}
            b={points[b]}
            c={points[c]}
            color={color}
            isActive={isActive}
          />
        ))}

        {segments.map(([from, to, color]) => (
          <EdgeBeam
            key={`${from}-${to}`}
            start={points[from]}
            end={points[to]}
            color={color}
            isActive={isActive}
            thickness={0.17}
          />
        ))}

        <mesh position={[0, -6.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.45, 2.95, 48]} />
          <meshBasicMaterial
            color={isActive ? '#67e8f9' : '#4ec5dd'}
            transparent
            opacity={isActive ? 0.8 : 0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <pointLight
          position={[0, 0.25, 0]}
          intensity={isActive ? 1.25 : 0.72}
          color="#7dd3fc"
          distance={130}
          decay={2}
        />
      </group>
    </Float>
  );
};

const Platform = ({ 
  position, 
  sectionId, 
  isActive,
  showLabel = true,
}) => {
  const platformRef = useRef();

  return (
    <RigidBody type="fixed" position={position}>
      <group ref={platformRef}>
        {/* Platform base */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[8, 8, 1, 32]} />
          <meshStandardMaterial 
            color={isActive ? '#00ffff' : '#3a1a4a'} 
            emissive={isActive ? '#00ffff' : '#1a0a2a'} 
            emissiveIntensity={isActive ? 0.5 : 0.1} 
          />
        </mesh>

        {/* Platform ring */}
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6, 9, 32]} />
          <meshBasicMaterial 
            color={isActive ? '#ff00ff' : '#8B00FF'} 
            transparent 
            opacity={isActive ? 0.8 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Section label */}
        {showLabel && (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Html position={[0, 2, 0]}>
              <div className={`text-xl font-bold orbitron ${isActive ? 'text-space-neon glow' : 'text-white'}`}>
                {sectionId.toUpperCase()}
              </div>
            </Html>
          </Float>
        )}

        <CheckpointDiamond isActive={isActive} y={sectionId === 'about' ? 19 : 12} />

        {sectionId === 'about' && <AboutHologram />}

      </group>
    </RigidBody>
  );
};

export default Platform;
