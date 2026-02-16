import React from 'react';
import {
  MousePointer2,
  Keyboard,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const Controls = ({ onToggle }) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-space-blue/50 backdrop-blur-sm p-6 rounded-2xl border border-space-neon/30 holographic pointer-events-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white orbitron glow">CONTROLS</h3>
        <button
          className="text-space-neon hover:text-white transition-colors duration-300"
          onClick={onToggle}
        >
          x
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
        {/* Mouse Controls */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MousePointer2 className="w-5 h-5 text-space-neon" />
            <span className="font-mono">MOUSE</span>
          </div>
          <div className="ml-7 space-y-1">
            <p>Click scene to lock pointer</p>
            <p>Move mouse to aim camera/ship</p>
            <p>Press ESC to release cursor</p>
          </div>
        </div>

        {/* Keyboard Controls */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5 text-space-pink" />
            <span className="font-mono">KEYBOARD</span>
          </div>
          <div className="ml-7">
            <div className="flex items-center space-x-1 mb-1">
              <ChevronUp className="w-4 h-4" />
              <span className="font-mono">W</span>
              <span>Thrust Forward</span>
            </div>
            <div className="flex items-center space-x-1 mb-1">
              <ChevronDown className="w-4 h-4" />
              <span className="font-mono">S</span>
              <span>Thrust Back</span>
            </div>
            <div className="flex items-center space-x-1 mb-1">
              <ChevronLeft className="w-4 h-4" />
              <span className="font-mono">A</span>
              <span>Strafe Left</span>
            </div>
            <div className="flex items-center space-x-1 mb-1">
              <ChevronRight className="w-4 h-4" />
              <span className="font-mono">D</span>
              <span>Strafe Right</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-mono">SPACE</span>
              <span>Thrust Up</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-mono">SHIFT</span>
              <span>Thrust Down</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-space-neon text-center">
        <p>Stations open full-screen. Use right-side navigator for skills.</p>
        <p className="mt-1">On phone/touch devices, joystick auto-appears.</p>
      </div>
    </div>
  );
};

export default Controls;
