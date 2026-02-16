import React, { useRef, useState } from 'react';

const JOYSTICK_RADIUS = 48;
const KNOB_RADIUS = 22;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const MobileJoystick = ({ controlsRef }) => {
  const baseRef = useRef(null);
  const activePointerIdRef = useRef(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const updateJoystick = (clientX, clientY) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const distance = Math.hypot(dx, dy);
    if (distance > JOYSTICK_RADIUS) {
      const scale = JOYSTICK_RADIUS / distance;
      dx *= scale;
      dy *= scale;
    }

    setKnob({ x: dx, y: dy });
    controlsRef.current.x = clamp(dx / JOYSTICK_RADIUS, -1, 1);
    controlsRef.current.y = clamp(-dy / JOYSTICK_RADIUS, -1, 1);
  };

  const resetJoystick = () => {
    activePointerIdRef.current = null;
    setKnob({ x: 0, y: 0 });
    controlsRef.current.x = 0;
    controlsRef.current.y = 0;
  };

  return (
    <div className="absolute left-4 bottom-5 z-30 pointer-events-auto flex items-end gap-4 select-none touch-none">
      <div
        ref={baseRef}
        className="relative w-28 h-28 rounded-full border border-sky-300/80 bg-space-dark/60 shadow-[0_0_18px_rgba(56,189,248,0.45)] touch-none"
        onPointerDown={(event) => {
          activePointerIdRef.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
          updateJoystick(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (activePointerIdRef.current !== event.pointerId) return;
          updateJoystick(event.clientX, event.clientY);
        }}
        onPointerUp={(event) => {
          if (activePointerIdRef.current !== event.pointerId) return;
          resetJoystick();
        }}
        onPointerCancel={(event) => {
          if (activePointerIdRef.current !== event.pointerId) return;
          resetJoystick();
        }}
      >
        <div className="absolute inset-2 rounded-full border border-sky-300/40" />
        <div
          className="absolute left-1/2 top-1/2 rounded-full border border-white/70 bg-sky-300/80 shadow-[0_0_14px_rgba(56,189,248,0.9)]"
          style={{
            width: `${KNOB_RADIUS * 2}px`,
            height: `${KNOB_RADIUS * 2}px`,
            transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="w-12 h-12 rounded-xl border border-sky-300/80 bg-space-blue/70 text-sky-200 text-xs"
          onPointerDown={() => {
            controlsRef.current.up = true;
          }}
          onPointerUp={() => {
            controlsRef.current.up = false;
          }}
          onPointerLeave={() => {
            controlsRef.current.up = false;
          }}
          onPointerCancel={() => {
            controlsRef.current.up = false;
          }}
        >
          UP
        </button>
        <button
          type="button"
          className="w-12 h-12 rounded-xl border border-sky-300/80 bg-space-blue/70 text-sky-200 text-xs"
          onPointerDown={() => {
            controlsRef.current.down = true;
          }}
          onPointerUp={() => {
            controlsRef.current.down = false;
          }}
          onPointerLeave={() => {
            controlsRef.current.down = false;
          }}
          onPointerCancel={() => {
            controlsRef.current.down = false;
          }}
        >
          DN
        </button>
      </div>
    </div>
  );
};

export default MobileJoystick;
