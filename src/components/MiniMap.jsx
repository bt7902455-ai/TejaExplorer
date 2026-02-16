import React, { useMemo } from 'react';

const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const getRadius = (bounds) => bounds.radius ?? Math.max(bounds.x ?? 0, bounds.z ?? 0);

const toMapCoords = (x, z, bounds) => {
  const radius = getRadius(bounds);
  const left = ((x + radius) / (radius * 2)) * 100;
  const top = ((radius - z) / (radius * 2)) * 100;

  return {
    left: Math.max(0, Math.min(100, left)),
    top: Math.max(0, Math.min(100, top)),
  };
};

const getHeading = (dx, dz) => {
  const angle = Math.atan2(dx, dz);
  const normalized = (angle + Math.PI * 2) % (Math.PI * 2);
  const index = Math.round(normalized / (Math.PI / 4)) % 8;
  return directions[index];
};

const MiniMap = ({
  shipPosition,
  shipYaw = 0,
  sections,
  bounds,
  destinationId,
  onSelectDestination,
}) => {
  const shipMap = useMemo(
    () => toMapCoords(shipPosition.x, shipPosition.z, bounds),
    [shipPosition.x, shipPosition.z, bounds]
  );

  const destination = useMemo(
    () => sections.find((section) => section.id === destinationId) || null,
    [sections, destinationId]
  );

  const destinationMap = destination
    ? toMapCoords(destination.position[0], destination.position[2], bounds)
    : null;

  const compass = useMemo(() => {
    const forwardX = -Math.sin(shipYaw);
    const forwardZ = -Math.cos(shipYaw);
    const headingRadians = Math.atan2(forwardX, forwardZ);
    const headingDegrees = ((headingRadians * 180) / Math.PI + 360) % 360;
    const index = Math.round(headingDegrees / 45) % 8;

    return {
      heading: directions[index],
      degrees: headingDegrees,
    };
  }, [shipYaw]);

  const guidance = useMemo(() => {
    if (!destination) return null;

    const dx = destination.position[0] - shipPosition.x;
    const dz = destination.position[2] - shipPosition.z;
    const dy = destination.position[1] - shipPosition.y;
    const distance = Math.hypot(dx, dz);

    return {
      heading: getHeading(dx, dz),
      distance,
      altitudeDiff: dy,
      arrived: distance < 10,
    };
  }, [destination, shipPosition.x, shipPosition.y, shipPosition.z]);

  return (
    <div className="absolute top-6 right-6 w-72 bg-space-blue/60 backdrop-blur-md rounded-2xl border border-sky-300/80 shadow-[0_0_24px_rgba(56,189,248,0.65)] pointer-events-auto p-4">
      <h3 className="text-white orbitron text-sm mb-2">NAV MAP</h3>

      <div className="mb-3 rounded-xl border border-sky-300/50 bg-space-dark/55 p-2">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full border border-sky-300/70 bg-space-dark/70 shadow-[inset_0_0_16px_rgba(56,189,248,0.35)]">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-sky-200 font-semibold">N</span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-sky-200 font-semibold">S</span>
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-sky-200 font-semibold">W</span>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-sky-200 font-semibold">E</span>

            <div
              className="absolute left-1/2 top-1/2 w-[2px] h-5 bg-sky-300 shadow-[0_0_8px_rgba(56,189,248,1)] origin-bottom"
              style={{
                transform: `translateX(-50%) translateY(-100%) rotate(${compass.degrees}deg)`,
              }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-300" />
          </div>

          <div className="text-xs">
            <p className="text-sky-200">Compass</p>
            <p className="text-white">
              {compass.heading} {Math.round(compass.degrees)} deg
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-square rounded-xl border border-sky-300/70 bg-space-dark/80 overflow-hidden shadow-[inset_0_0_20px_rgba(56,189,248,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_60%)]" />
        <div className="absolute inset-[6%] rounded-full border border-sky-300/60 pointer-events-none" />

        {destinationMap && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={`${shipMap.left}%`}
              y1={`${shipMap.top}%`}
              x2={`${destinationMap.left}%`}
              y2={`${destinationMap.top}%`}
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="5 4"
            />
          </svg>
        )}

        {sections.map((section) => {
          const pos = toMapCoords(section.position[0], section.position[2], bounds);
          const active = destinationId === section.id;

          return (
            <button
              key={section.id}
              type="button"
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border transition-all duration-200 ${
                active
                  ? 'bg-sky-300 border-white shadow-[0_0_10px_rgba(56,189,248,1)] scale-125'
                  : 'bg-space-pink border-space-neon hover:scale-110'
              }`}
              style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
              onClick={() => onSelectDestination(section.id)}
              title={`Set destination: ${section.id}`}
            />
          );
        })}

        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-sky-300 border border-white shadow-[0_0_12px_rgba(56,189,248,1)]"
          style={{ left: `${shipMap.left}%`, top: `${shipMap.top}%` }}
          title="Your position"
        />
      </div>

      <p className="text-sky-200 text-xs mt-3">Click a marker to set GPS destination.</p>

      {destination && guidance && (
        <div className="mt-2 text-xs text-white space-y-1">
          <p>
            Destination: <span className="text-sky-300">{destination.id.toUpperCase()}</span>
          </p>
          <p>
            {guidance.arrived
              ? 'GPS: Destination reached.'
              : `GPS: Head ${guidance.heading} for ${Math.round(guidance.distance)}m`}
          </p>
          <p>
            Altitude: {Math.abs(guidance.altitudeDiff) < 1
              ? 'Hold level'
              : `${guidance.altitudeDiff > 0 ? 'Climb' : 'Descend'} ${Math.round(Math.abs(guidance.altitudeDiff))}m`}
          </p>
          <button
            type="button"
            className="mt-1 text-sky-300 hover:text-white transition-colors"
            onClick={() => onSelectDestination(null)}
          >
            Clear destination
          </button>
        </div>
      )}
    </div>
  );
};

export default MiniMap;
