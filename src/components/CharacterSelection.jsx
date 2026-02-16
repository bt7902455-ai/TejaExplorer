import React from 'react';
import { Canvas } from '@react-three/fiber';
import PilotCharacter3D from './PilotCharacter3D';

const CHARACTERS = [
  {
    id: 'nova',
    name: 'Teja Explorer',
    role: 'Recon Suit',
    accent: '#67e8f9',
  },
  {
    id: 'orion',
    name: 'Teja Vanguard',
    role: 'Command Suit',
    accent: '#a78bfa',
  },
  {
    id: 'sol',
    name: 'Teja Navigator',
    role: 'Solar Suit',
    accent: '#facc15',
  },
];

const CharacterPreview3D = ({ variant }) => {
  return (
    <div className="h-56 rounded-xl border border-space-neon/25 bg-space-dark/85 overflow-hidden">
      <Canvas className="pointer-events-none" camera={{ position: [0, 0.45, 3.9], fov: 30 }} dpr={[1, 1.5]}>
        <ambientLight intensity={1.0} />
        <directionalLight position={[2, 3, 2]} intensity={1.1} />
        <pointLight position={[-2, 1, 2]} intensity={0.8} color="#67e8f9" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
          <circleGeometry args={[1.2, 40]} />
          <meshStandardMaterial color="#10223c" emissive="#1d4d75" emissiveIntensity={0.24} />
        </mesh>

        <group position={[0, -0.48, 0]}>
          <PilotCharacter3D variant={variant} animate preview />
        </group>
      </Canvas>
    </div>
  );
};

const CharacterSelection = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-space-dark flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.18),transparent_45%)]" />

      <div className="relative w-[min(95vw,980px)] rounded-3xl border border-space-neon/45 bg-space-blue/40 backdrop-blur-md shadow-[0_0_40px_rgba(0,255,255,0.2)] p-6 md:p-8">
        <p className="text-sky-300 text-xs uppercase tracking-[0.16em]">Launch Protocol</p>
        <h1 className="text-3xl md:text-5xl text-white orbitron mt-2">
          Select Your Pilot
        </h1>
        <p className="text-gray-300 mt-3 max-w-2xl">
          Choose a 3D animated pilot before launch. The selected character appears in your spaceship cockpit.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {CHARACTERS.map((character) => (
            <button
              key={character.id}
              type="button"
              className="group rounded-2xl border border-space-neon/35 bg-space-dark/55 p-4 text-left hover:border-space-neon hover:shadow-[0_0_22px_rgba(56,189,248,0.35)] transition-all duration-300"
              onClick={() => onSelect(character.id)}
            >
              <CharacterPreview3D variant={character.id} />
              <p className="mt-4 text-white font-semibold">{character.name}</p>
              <p className="text-sky-300 text-sm mt-1">{character.role}</p>
              <p className="text-xs mt-2" style={{ color: character.accent }}>
                3D Animated Character
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSelection;
