import React from 'react';

const ExperienceSection = () => {
  const experiences = [
    {
      title: 'AP Scholar with Distinction',
      period: '11th Grade - Present',
      description: 'Awarded for scoring 3 or higher on five or more AP exams with an average score of 3.5 or higher.'
    },
    {
      title: 'College Board National Recognition Program',
      period: '11th Grade - Present',
      description: 'Recognized for outstanding academic achievement and commitment to rigorous coursework.'
    },
    {
      title: 'Founder, Bixby Academic Mentors',
      period: '11th Grade - Present',
      description: 'Founded a free academic tutoring club, onboarded 15 teachers and 30 students. Website: bixbyspartanhub.github.io.'
    },
    {
      title: 'Blockchain Summer Program - RIT',
      period: '10th Grade',
      description: 'Studied decentralized systems, smart contracts, and cryptocurrency. Visited Foundry Mining Facility in NYC.'
    },
    {
      title: 'Web Development, Tulsa Tech',
      period: '2023-2024',
      description: 'Professional web development training covering modern frameworks, responsive design, and full-stack development.'
    },
    {
      title: 'Experimental Engineering Projects - Peltier',
      period: 'Ongoing',
      description: 'Explored Peltier energy modules, deepening applied physics knowledge.'
    },
    {
      title: 'Chromebook OS Conversion',
      period: 'Ongoing',
      description: 'Customized BIOS, improved performance and cybersecurity.'
    }
  ];

  return (
    <div className="holographic p-6 rounded-2xl max-w-md scanlines max-h-96 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white orbitron mb-4 glow">
        EXPERIENCE & EDUCATION
      </h2>
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={index} className="border border-space-neon/30 rounded-lg p-3 hover:border-space-pink/50 transition-all duration-300">
            <h3 className="text-space-neon font-semibold mb-1">{exp.title}</h3>
            <p className="text-sm text-gray-400 mb-2">{exp.period}</p>
            <p className="text-gray-300 text-sm">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
