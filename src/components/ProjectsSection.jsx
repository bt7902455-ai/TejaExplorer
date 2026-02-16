import React from 'react';

const ProjectsSection = () => {
  const projects = [
    {
      name: "Chemical Research",
      description: "Research on biochar to graphene conversion for anti-corrosive coatings using hydrothermal carbonization and galvanic E-cell testing.",
      tags: ["Materials Science", "Chemistry", "Research"]
    },
    {
      name: "Bixby Academic Mentors App",
      description: "Mobile app connecting tutors and students with scheduling, messaging, and subject selection features.",
      tags: ["Mobile App", "UI/UX", "Full-Stack"]
    },
    {
      name: "AI Restaurant Discovery App",
      description: "Greenbites app with AI-powered recommendations, personalized cuisine matching, and in-app purchases.",
      tags: ["AI/ML", "iOS", "SwiftUI"]
    },
    {
      name: "Peltier Electricity Generator",
      description: "Experimental thermoelectric power generation system measuring efficiency of Peltier modules.",
      tags: ["Hardware", "Thermoelectrics", "Renewable Energy"]
    },
    {
      name: "Chromebook OS Conversion",
      description: "Customized BIOS and system optimization for ChromeOS to Linux conversion.",
      tags: ["Linux", "System Optimization"]
    }
  ];

  return (
    <div className="holographic p-6 rounded-2xl max-w-md scanlines max-h-96 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white orbitron mb-4 glow">
        PROJECTS
      </h2>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="border border-space-neon/30 rounded-lg p-3 hover:border-space-pink/50 transition-all duration-300">
            <h3 className="text-space-neon font-semibold mb-2">{project.name}</h3>
            <p className="text-gray-300 text-sm mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="text-xs bg-space-blue/50 text-space-neon px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;