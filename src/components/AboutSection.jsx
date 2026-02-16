import React from 'react';

const AboutSection = () => {
  return (
    <div className="holographic p-6 rounded-2xl max-w-md scanlines">
      <h2 className="text-2xl font-bold text-white orbitron mb-4 glow">
        ABOUT ME
      </h2>
      <p className="text-gray-300 mb-4">
        I'm a tech innovator who builds AI and hardware systems that actually work.
        I do not just talk about innovation - I experiment with it constantly. From
        Peltier generators to local AI pipelines, I combine deep technical
        knowledge with hands-on engineering to create solutions that solve real
        problems.
      </p>
      <p className="text-gray-300 mb-4">
        <strong className="text-space-neon">Why I am Different:</strong> I bridge
        the gap between AI/software and hardware engineering. Most engineers
        specialize in one; I excel at both. I have proven this through diverse
        projects: thermoenergy systems, computer vision, blockchain, and
        intelligent automation.
      </p>
      <p className="text-gray-300">
        <strong className="text-space-pink">My Approach:</strong> I believe great
        tech does not require unlimited resources - it requires curiosity,
        experimentation, and relentless iteration. Every project teaches me
        something. Every failure is a blueprint for success.
      </p>
    </div>
  );
};

export default AboutSection;
