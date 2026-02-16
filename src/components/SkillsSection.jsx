import React from 'react';

const SkillsSection = () => {
  const skills = [
    { category: "Programming Languages", items: ["Python", "JavaScript", "HTML/CSS", "Java"] },
    { category: "AI & Machine Learning", items: ["AI/ML", "TensorFlow Lite", "Core ML", "Computer Vision"] },
    { category: "Web Development", items: ["JavaScript", "APIs", "Responsive Design", "Git/GitHub"] },
    { category: "Hardware & Engineering", items: ["Thermoelectrics", "Prototyping", "Renewable Energy", "Embedded Systems"] },
    { category: "Tools & Platforms", items: ["Git/GitHub", "VS Code", "Linux", "Xcode", "Firebase"] },
    { category: "Other Specialties", items: ["Crypto/Blockchain", "System Optimization", "Automation", "MapKit"] },
    { category: "Research", items: ["Materials Science", "Graphene", "Corrosion Prevention"] }
  ];

  return (
    <div className="holographic p-6 rounded-2xl max-w-md scanlines max-h-96 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white orbitron mb-4 glow">
        SKILLS & EXPERTISE
      </h2>
      <div className="space-y-3">
        {skills.map((skillGroup, index) => (
          <div key={index}>
            <h3 className="text-space-pink font-semibold mb-2">{skillGroup.category}</h3>
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map((skill, skillIndex) => (
                <span key={skillIndex} className="text-xs bg-space-blue/50 text-white px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;