import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, SoftShadows } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import Spaceship from './components/Spaceship';
import Platform from './components/Platform';
import Background from './components/Background';
import LoadingScreen from './components/LoadingScreen';
import Controls from './components/Controls';
import MiniMap from './components/MiniMap';
import StationOverlay from './components/StationOverlay';
import AlienSpaceCenter from './components/AlienSpaceCenter';
import MobileJoystick from './components/MobileJoystick';
import CharacterSelection from './components/CharacterSelection';

const WORLD_BOUNDS = {
  radius: 110,
  minY: 0,
  maxY: 5,
};

const PLATFORM_LEVEL = 2;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [dismissedSection, setDismissedSection] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [destinationId, setDestinationId] = useState(null);
  const [isPhoneDevice, setIsPhoneDevice] = useState(false);
  const [shipHudPosition, setShipHudPosition] = useState({ x: 0, y: PLATFORM_LEVEL, z: -20 });
  const [shipHudYaw, setShipHudYaw] = useState(0);
  const shipPositionRef = useRef(new THREE.Vector3(0, PLATFORM_LEVEL, -20));
  const shipOrientationRef = useRef({ yaw: 0, pitch: 0 });
  const virtualControlsRef = useRef({ x: 0, y: 0, up: false, down: false });

  useEffect(() => {
    if (!selectedCharacter) return;
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [selectedCharacter]);

  useEffect(() => {
    const detectPhoneDevice = () => {
      const touchCapable = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
      const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsPhoneDevice(touchCapable || mobileUserAgent);
    };

    detectPhoneDevice();
    window.addEventListener('resize', detectPhoneDevice);
    return () => window.removeEventListener('resize', detectPhoneDevice);
  }, []);

  useEffect(() => {
    const hudUpdateInterval = setInterval(() => {
      const currentPosition = shipPositionRef.current;
      const currentYaw = shipOrientationRef.current.yaw;
      setShipHudPosition((previous) => {
        if (
          Math.abs(previous.x - currentPosition.x) < 0.2 &&
          Math.abs(previous.y - currentPosition.y) < 0.2 &&
          Math.abs(previous.z - currentPosition.z) < 0.2
        ) {
          return previous;
        }

        return { x: currentPosition.x, y: currentPosition.y, z: currentPosition.z };
      });
      setShipHudYaw((previous) => {
        if (Math.abs(previous - currentYaw) < 0.01) return previous;
        return currentYaw;
      });
    }, 90);

    return () => clearInterval(hudUpdateInterval);
  }, []);

  useEffect(() => {
    if (!activeSection) return;
    virtualControlsRef.current.x = 0;
    virtualControlsRef.current.y = 0;
    virtualControlsRef.current.up = false;
    virtualControlsRef.current.down = false;
  }, [activeSection]);

  const sections = useMemo(
    () => [
      { id: 'about', position: [0, PLATFORM_LEVEL, 0] },
      { id: 'projects', position: [70, PLATFORM_LEVEL, 55] },
      { id: 'skills', position: [-70, PLATFORM_LEVEL, 55] },
      { id: 'experience', position: [0, PLATFORM_LEVEL, 85] },
      { id: 'contact', position: [65, PLATFORM_LEVEL, -65] },
    ],
    []
  );

  const handleSectionChange = (sectionId) => {
    if (!sectionId) {
      setActiveSection(null);
      setDismissedSection(null);
      return;
    }

    if (dismissedSection === sectionId) return;
    setActiveSection(sectionId);
  };

  const closeStationOverlay = () => {
    if (activeSection) {
      setDismissedSection(activeSection);
    }
    setActiveSection(null);
  };

  const selectStation = (sectionId) => {
    setDismissedSection(null);
    setActiveSection(sectionId);
    setDestinationId(sectionId);
  };

  if (!selectedCharacter) {
    return <CharacterSelection onSelect={setSelectedCharacter} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-space-dark">
      {loading && <LoadingScreen />}

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, PLATFORM_LEVEL + 4, 12]} fov={62} />
        <CameraFollow targetRef={shipPositionRef} orientationRef={shipOrientationRef} />

        <SoftShadows size={10} samples={10} focus={0.5} />

        <ambientLight intensity={0.25} color="#38bdf8" />
        <pointLight position={[18, 15, 12]} intensity={1.1} color="#38bdf8" />
        <pointLight position={[-16, 10, -16]} intensity={0.6} color="#ff00ff" />

        <Background />
        <AlienSpaceCenter bounds={WORLD_BOUNDS} />
        <WorldBoundary bounds={WORLD_BOUNDS} />

        <Physics gravity={[0, 0, 0]}>
          <Spaceship
            onSectionChange={handleSectionChange}
            sections={sections}
            bounds={WORLD_BOUNDS}
            selectedCharacter={selectedCharacter}
            controlsEnabled={!activeSection}
            virtualControlsRef={virtualControlsRef}
            onPositionUpdate={(position) => {
              shipPositionRef.current.copy(position);
            }}
            onOrientationUpdate={(orientation) => {
              shipOrientationRef.current.yaw = orientation.yaw;
              shipOrientationRef.current.pitch = orientation.pitch;
            }}
          />

          {sections.map((section) => (
            <Platform
              key={section.id}
              position={section.position}
              sectionId={section.id}
              isActive={activeSection === section.id}
              showLabel={!activeSection}
            />
          ))}

          {[...Array(4)].map((_, i) => (
            <RobotDrone key={i} index={i} targetRef={shipPositionRef} />
          ))}
        </Physics>
      </Canvas>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        <div className="absolute top-6 left-6">
          <h1 className="text-4xl font-bold text-white orbitron glow">
            TEJA <span className="text-space-neon">EXPLORER</span>
          </h1>
          <p className="text-space-neon text-sm mt-1">SPACE EXPLORATION PORTFOLIO</p>
          <p className="text-sky-300 text-xs mt-2">Sky-blue border marks the playable zone.</p>
        </div>

        {!activeSection && (
          <MiniMap
            shipPosition={shipHudPosition}
            shipYaw={shipHudYaw}
            sections={sections}
            bounds={WORLD_BOUNDS}
            destinationId={destinationId}
            onSelectDestination={setDestinationId}
          />
        )}

        {showControls && (
          <Controls
            onToggle={() => setShowControls(false)}
          />
        )}

        {!showControls && (
          <button
            className="absolute top-6 right-[21rem] bg-space-blue/50 hover:bg-space-blue/70 text-white px-4 py-2 rounded-full transition-all duration-300 pointer-events-auto border border-space-neon/30"
            onClick={() => setShowControls(true)}
          >
            Show Controls
          </button>
        )}

        {isPhoneDevice && !activeSection && (
          <MobileJoystick controlsRef={virtualControlsRef} />
        )}
      </div>

      {activeSection && (
        <StationOverlay
          activeSectionId={activeSection}
          onClose={closeStationOverlay}
          onSelectSection={selectStation}
        />
      )}
    </div>
  );
};

const CameraFollow = ({ targetRef, orientationRef }) => {
  const { camera } = useThree();
  const offset = useRef(new THREE.Vector3(0, 6, 13));
  const desiredPosition = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3());
  const lookDirection = useRef(new THREE.Vector3(0, 0, -1));
  const cameraEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const rotatedOffset = useRef(new THREE.Vector3());
  const rotatedForward = useRef(new THREE.Vector3());

  useFrame(() => {
    const { yaw, pitch } = orientationRef.current;
    cameraEuler.current.set(pitch * 0.35, yaw, 0);

    rotatedOffset.current.copy(offset.current).applyEuler(cameraEuler.current);
    desiredPosition.current.copy(targetRef.current).add(rotatedOffset.current);
    camera.position.lerp(desiredPosition.current, 0.1);

    rotatedForward.current.copy(lookDirection.current).applyEuler(cameraEuler.current).multiplyScalar(36);
    lookAtTarget.current.copy(targetRef.current).add(rotatedForward.current);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
};

const WorldBoundary = ({ bounds }) => {
  const radius = bounds.radius;
  const height = 30;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const borderColor = '#38bdf8';

  return (
    <group position={[0, centerY, 0]}>
      <mesh>
        <cylinderGeometry args={[radius, radius, height, 96, 1, true]} />
        <meshBasicMaterial color={borderColor} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, -height / 2 + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.9, radius + 0.9, 128]} />
        <meshBasicMaterial color={borderColor} transparent opacity={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, height / 2 - 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.8, radius + 0.8, 128]} />
        <meshBasicMaterial color={borderColor} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const RobotDrone = ({ index, targetRef }) => {
  const meshRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const haloRef = useRef();
  const sparkleRefs = useRef([]);
  const speed = 0.18 + index * 0.04;
  const radius = 30 + index * 16;
  const phase = index * 0.95;
  const baseY = 4.4;
  const sparkData = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        angle: (i / 9) * Math.PI * 2,
        radius: 0.12 + Math.random() * 0.18,
        orbitSpeed: 1.2 + Math.random() * 1.4,
        fallSpeed: 0.45 + Math.random() * 0.35,
      })),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();
    const orbit = t * speed + phase;
    meshRef.current.position.x = Math.cos(orbit) * radius;
    meshRef.current.position.z = Math.sin(orbit) * radius;
    meshRef.current.position.y = baseY + Math.sin(t * 2 + phase) * 0.46;
    meshRef.current.rotation.z = Math.sin(t * 1.2 + phase) * 0.07;

    if (targetRef?.current) {
      const lookTarget = targetRef.current;
      meshRef.current.lookAt(lookTarget.x, meshRef.current.position.y, lookTarget.z);
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.35 + Math.sin(t * 3.2 + phase) * 0.28;
      leftArmRef.current.rotation.x = Math.sin(t * 2.1 + phase) * 0.08;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.35 - Math.sin(t * 2.7 + phase) * 0.2;
      rightArmRef.current.rotation.x = -Math.sin(t * 2.1 + phase) * 0.08;
    }

    if (haloRef.current) {
      const pulse = 1 + Math.sin(t * 4.2 + phase) * 0.12;
      haloRef.current.scale.setScalar(pulse);
    }

    sparkData.forEach((spark, i) => {
      const node = sparkleRefs.current[i];
      if (!node) return;
      const spinAngle = t * spark.orbitSpeed + spark.angle;
      const cycle = (t * spark.fallSpeed + i * 0.12) % 1;
      const radiusJitter = spark.radius * (1 + Math.sin(t * 3 + i) * 0.08);
      node.position.x = Math.cos(spinAngle) * radiusJitter;
      node.position.z = Math.sin(spinAngle) * radiusJitter;
      node.position.y = -1.02 - cycle * 0.75;
      node.scale.setScalar(0.45 + (1 - cycle) * 0.9);
      node.material.opacity = 0.15 + (1 - cycle) * 0.72;
    });
  });

  return (
    <RigidBody type="fixed">
      <group ref={meshRef} scale={[1.15, 1.15, 1.15]}>
        {/* Main white body */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.88, 0.78, 1.35, 26]} />
          <meshStandardMaterial color="#f3f4f6" metalness={0.08} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <torusGeometry args={[0.86, 0.06, 14, 40]} />
          <meshStandardMaterial color="#e5e7eb" />
        </mesh>
        <mesh position={[0, -0.86, 0]}>
          <sphereGeometry args={[0.72, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.15} roughness={0.4} />
        </mesh>

        {/* Red shoulder wings */}
        <mesh position={[0, 0.02, 0.74]}>
          <boxGeometry args={[2.4, 0.1, 0.18]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.16} />
        </mesh>
        <mesh position={[-1.06, 0.01, 0.66]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.98, 0.09, 0.32]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.12} />
        </mesh>
        <mesh position={[1.06, 0.01, 0.66]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.98, 0.09, 0.32]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.12} />
        </mesh>

        {/* Head shell and visor */}
        <mesh position={[0, 1.03, 0.02]}>
          <capsuleGeometry args={[0.56, 0.26, 8, 16]} />
          <meshStandardMaterial color="#111827" metalness={0.22} roughness={0.26} />
        </mesh>
        <mesh position={[0, 1.09, 0.44]}>
          <planeGeometry args={[0.86, 0.35]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.8} metalness={0.1} roughness={0.2} />
        </mesh>
        <mesh position={[-0.58, 1.01, 0.02]}>
          <cylinderGeometry args={[0.08, 0.08, 0.32, 10]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.4} roughness={0.28} />
        </mesh>
        <mesh position={[0.58, 1.01, 0.02]}>
          <cylinderGeometry args={[0.08, 0.08, 0.32, 10]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.4} roughness={0.28} />
        </mesh>

        {/* Face icon */}
        <mesh position={[-0.15, 1.1, 0.46]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.15, 1.1, 0.46]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 1.02, 0.46]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.08, 0.013, 8, 18, Math.PI]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Arms and hands */}
        <group ref={leftArmRef} position={[-1.18, 0.2, 0.2]} rotation={[0, 0, 0.35]}>
          <mesh>
            <capsuleGeometry args={[0.075, 0.56, 8, 12]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.38} />
          </mesh>
          <mesh position={[0, -0.36, 0]}>
            <sphereGeometry args={[0.095, 10, 10]} />
            <meshStandardMaterial color="#d1d5db" />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[1.18, 0.2, 0.2]} rotation={[0, 0, -0.35]}>
          <mesh>
            <capsuleGeometry args={[0.075, 0.56, 8, 12]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.38} />
          </mesh>
          <mesh position={[0, -0.36, 0]}>
            <sphereGeometry args={[0.095, 10, 10]} />
            <meshStandardMaterial color="#d1d5db" />
          </mesh>
        </group>

        {/* Center chest emblem and thruster */}
        <mesh position={[0, -0.18, 0.82]}>
          <coneGeometry args={[0.1, 0.4, 10]} />
          <meshStandardMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={0.32} />
        </mesh>
        <mesh position={[0, -1.08, 0]}>
          <coneGeometry args={[0.16, 0.44, 14]} />
          <meshStandardMaterial color="#6b7280" emissive="#0ea5e9" emissiveIntensity={0.12} />
        </mesh>
        <pointLight position={[0, -1.16, 0]} intensity={0.8} color="#38bdf8" distance={11} decay={2} />

        {/* Bottom sparkle halo effect */}
        <group ref={haloRef} position={[0, -1.16, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.18, 0.46, 36]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.7} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.08, 0.21, 28]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {sparkData.map((_, i) => (
            <mesh
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              ref={(el) => {
                sparkleRefs.current[i] = el;
              }}
              position={[0, -1.1, 0]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color="#7dd3fc" transparent opacity={0.5} depthWrite={false} />
            </mesh>
          ))}
        </group>
      </group>
    </RigidBody>
  );
};

export default App;
