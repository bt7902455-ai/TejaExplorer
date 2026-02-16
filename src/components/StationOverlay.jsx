import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Github, Linkedin, Mail, X } from 'lucide-react';
import profileImage from '../../TejaMathukumalliPictureLinkedIn.jpg';

const STATION_ORDER = ['about', 'projects', 'skills', 'experience', 'contact'];

const STATION_META = {
  about: {
    title: 'About Station',
    subtitle: 'Profile Core',
    status: 'Identity stream synced',
  },
  projects: {
    title: 'Projects Station',
    subtitle: 'Build Archive',
    status: 'Project telemetry online',
  },
  skills: {
    title: 'Skills Station',
    subtitle: 'Capability Matrix',
    status: 'Skill graph loaded',
  },
  experience: {
    title: 'Experience Station',
    subtitle: 'Timeline Logs',
    status: 'History records indexed',
  },
  contact: {
    title: 'Contact Station',
    subtitle: 'Comms Hub',
    status: 'Secure channels active',
  },
};

const PROJECTS = [
  {
    name: 'Chemical Research',
    description: 'Biochar to graphene conversion for anti-corrosive coating systems with hydrothermal carbonization and galvanic E-cell testing.',
    tags: ['Materials Science', 'Chemistry', 'Research'],
  },
  {
    name: 'Bixby Academic Mentors',
    description: 'Mentoring platform for tutor-student matching, messaging, and scheduling workflows.',
    tags: ['Mobile App', 'UX', 'Full Stack'],
  },
  {
    name: 'AI Restaurant Discovery App',
    description: 'Greenbites recommendation system with preference-based suggestions and in-app commerce.',
    tags: ['AI/ML', 'iOS', 'SwiftUI'],
  },
  {
    name: 'Peltier Electricity Generator',
    description: 'Prototype thermoelectric generation platform measuring conversion efficiency and heat transfer behavior.',
    tags: ['Hardware', 'Thermoelectrics', 'Energy'],
  },
  {
    name: 'Chromebook OS Conversion',
    description: 'ChromeOS to Linux conversion with BIOS work, performance tuning, and security hardening.',
    tags: ['Linux', 'System Optimization'],
  },
];

const SKILLS = [
  {
    name: 'Python',
    category: 'Programming Languages',
    description: 'Automation, scripting, and data processing for AI and systems experiments.',
  },
  {
    name: 'JavaScript',
    category: 'Programming Languages',
    description: 'Web app development, UI logic, and interactive front-end systems.',
  },
  {
    name: 'AI/ML',
    category: 'AI and Machine Learning',
    description: 'Model experimentation, inference workflows, and applied intelligent automation.',
  },
  {
    name: 'Computer Vision',
    category: 'AI and Machine Learning',
    description: 'Image analysis pipelines with practical deployment constraints.',
  },
  {
    name: 'TensorFlow Lite',
    category: 'AI and Machine Learning',
    description: 'Lightweight model deployment for resource-constrained environments.',
  },
  {
    name: 'Core ML',
    category: 'AI and Machine Learning',
    description: 'On-device ML integration in Apple ecosystem applications.',
  },
  {
    name: 'APIs',
    category: 'Web Development',
    description: 'Service integration and endpoint design for full stack workflows.',
  },
  {
    name: 'Responsive Design',
    category: 'Web Development',
    description: 'Adaptive interfaces that remain clear across desktop and mobile.',
  },
  {
    name: 'Git/GitHub',
    category: 'Tools and Platforms',
    description: 'Versioned collaboration, review workflows, and release tracking.',
  },
  {
    name: 'Linux',
    category: 'Tools and Platforms',
    description: 'System-level debugging, configuration, and performance tuning.',
  },
  {
    name: 'Thermoelectrics',
    category: 'Hardware and Engineering',
    description: 'Experimental work with Peltier modules and energy conversion behavior.',
  },
  {
    name: 'Embedded Systems',
    category: 'Hardware and Engineering',
    description: 'Hardware-software integration in constrained systems.',
  },
  {
    name: 'Blockchain',
    category: 'Other Specialties',
    description: 'Decentralized architecture concepts and crypto ecosystem fundamentals.',
  },
  {
    name: 'Automation',
    category: 'Other Specialties',
    description: 'Process reduction through scripting and workflow orchestration.',
  },
  {
    name: 'Graphene Research',
    category: 'Research',
    description: 'Material characterization and applied coating use cases.',
  },
];

const EXPERIENCE = [
  {
    title: 'AP Scholar with Distinction',
    period: '11th Grade - Present',
    description: 'Awarded for scoring 3 or higher on five or more AP exams with an average of 3.5 or higher.',
  },
  {
    title: 'College Board National Recognition Program',
    period: '11th Grade - Present',
    description: 'Recognized for academic performance and sustained rigor in coursework.',
  },
  {
    title: 'Founder, Bixby Academic Mentors',
    period: '11th Grade - Present',
    description: 'Built a free tutoring club and coordinated mentors, teachers, and students.',
  },
  {
    title: 'Blockchain Summer Program, RIT',
    period: '10th Grade',
    description: 'Studied decentralized systems, smart contracts, and mining infrastructure.',
  },
  {
    title: 'Web Development, Tulsa Tech',
    period: '2023 - 2024',
    description: 'Completed modern web development training across responsive and full stack systems.',
  },
];

const CONTACT_CHANNELS = [
  {
    name: 'Email',
    value: 'mvsivateja@proton.me',
    href: 'mailto:mvsivateja@proton.me',
    icon: Mail,
  },
  {
    name: 'GitHub',
    value: 'github.com/VSTM26',
    href: 'https://github.com/VSTM26',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    value: 'linkedin.com/in/teja-mathukumalli',
    href: 'https://www.linkedin.com/in/teja-mathukumalli/',
    icon: Linkedin,
  },
];

const StationOverlay = ({ activeSectionId, onClose, onSelectSection }) => {
  const [selectedSkill, setSelectedSkill] = useState(SKILLS[0].name);

  const activeSkill = useMemo(
    () => SKILLS.find((skill) => skill.name === selectedSkill) || SKILLS[0],
    [selectedSkill]
  );

  useEffect(() => {
    if (activeSectionId !== 'skills') return;
    if (!SKILLS.some((skill) => skill.name === selectedSkill)) {
      setSelectedSkill(SKILLS[0].name);
    }
  }, [activeSectionId, selectedSkill]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      const currentIndex = STATION_ORDER.indexOf(activeSectionId);
      if (currentIndex === -1) return;

      if (event.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % STATION_ORDER.length;
        onSelectSection(STATION_ORDER[nextIndex]);
      }

      if (event.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + STATION_ORDER.length) % STATION_ORDER.length;
        onSelectSection(STATION_ORDER[prevIndex]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeSectionId, onClose, onSelectSection]);

  const currentIndex = STATION_ORDER.indexOf(activeSectionId);
  const prevStation = STATION_ORDER[(currentIndex - 1 + STATION_ORDER.length) % STATION_ORDER.length];
  const nextStation = STATION_ORDER[(currentIndex + 1) % STATION_ORDER.length];
  const meta = STATION_META[activeSectionId] || STATION_META.about;

  return (
    <div className="absolute inset-0 z-40 bg-space-dark/95 flex items-center justify-center p-4 pointer-events-auto">
      <div className="w-[min(96vw,1500px)] h-[min(92vh,860px)] rounded-3xl border border-space-neon/60 bg-space-dark shadow-[0_0_45px_rgba(0,255,255,0.25)] overflow-hidden grid grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative p-6 md:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.15),transparent_45%),radial-gradient(circle_at_85%_85%,rgba(255,0,255,0.12),transparent_40%)] pointer-events-none" />

          <div className="relative h-full flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-space-neon text-xs uppercase tracking-[0.18em]">Station Connected</p>
                <h2 className="text-3xl md:text-5xl text-white orbitron mt-1">{meta.title}</h2>
                <p className="text-sky-300 text-sm mt-1">{meta.subtitle}</p>
              </div>

              <button
                type="button"
                className="w-10 h-10 rounded-full bg-space-blue/70 border border-space-neon/60 text-space-neon hover:text-white hover:border-white transition-colors flex items-center justify-center"
                onClick={onClose}
                aria-label="Close station view"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <p className="text-sky-200">{meta.status}</p>
              <p className="text-gray-300">ESC to exit station view</p>
            </div>

            <div className="mt-5 flex-1 rounded-2xl border border-space-neon/30 bg-space-dark p-5 md:p-6 overflow-hidden">
              <div className="h-full overflow-y-auto pr-1">{renderStationContent(activeSectionId, activeSkill)}</div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-space-neon/50 text-space-neon hover:text-white hover:border-white transition-colors flex items-center gap-2"
                onClick={() => onSelectSection(prevStation)}
              >
                <ChevronLeft size={16} />
                Prev Station
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-space-neon/50 text-space-neon hover:text-white hover:border-white transition-colors flex items-center gap-2"
                onClick={() => onSelectSection(nextStation)}
              >
                Next Station
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <aside className="border-l border-space-neon/40 bg-space-blue/85 p-5 md:p-6 overflow-hidden flex flex-col">
          <h3 className="text-white orbitron text-sm tracking-[0.15em] uppercase">Stations</h3>
          <div className="mt-4 space-y-2">
            {STATION_ORDER.map((stationId) => (
              <button
                key={stationId}
                type="button"
                className={`w-full text-left rounded-xl px-3 py-2 border transition-all ${
                  stationId === activeSectionId
                    ? 'border-sky-300 bg-sky-300/20 text-white shadow-[0_0_14px_rgba(56,189,248,0.45)]'
                    : 'border-space-neon/40 text-sky-200 hover:text-white hover:border-space-neon'
                }`}
                onClick={() => onSelectSection(stationId)}
              >
                {STATION_META[stationId].title}
              </button>
            ))}
          </div>

          {activeSectionId === 'skills' && (
            <>
              <h4 className="mt-6 text-white orbitron text-xs uppercase tracking-[0.16em]">Skill Navigator</h4>
              <p className="text-sky-200 text-xs mt-2">Scroll and click a skill to inspect.</p>
              <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-2">
                {SKILLS.map((skill) => (
                  <button
                    key={skill.name}
                    type="button"
                    className={`w-full text-left rounded-lg px-3 py-2 border transition-all ${
                      skill.name === activeSkill.name
                        ? 'border-space-neon bg-space-neon/15 text-white'
                        : 'border-space-neon/35 text-sky-100 hover:border-space-neon'
                    }`}
                    onClick={() => setSelectedSkill(skill.name)}
                  >
                    <p className="text-sm font-semibold">{skill.name}</p>
                    <p className="text-[11px] text-gray-300">{skill.category}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

const renderStationContent = (stationId, activeSkill) => {
  if (stationId === 'about') {
    return (
      <div className="grid lg:grid-cols-[minmax(250px,340px)_1fr] gap-5 text-gray-100">
        <div className="rounded-2xl border border-space-neon/45 bg-space-dark/55 p-3">
          <div className="rounded-xl overflow-hidden border border-sky-300/70 shadow-[0_0_22px_rgba(56,189,248,0.35)]">
            <img
              src={profileImage}
              alt="Teja Mathukumalli standing portrait"
              className="w-full h-[460px] object-cover object-top"
            />
          </div>
          <p className="text-sky-300 text-xs uppercase tracking-[0.12em] mt-3">Crew Lead</p>
          <p className="text-white orbitron text-lg">Teja Mathukumalli</p>
        </div>

        <div className="space-y-5">
          <p className="text-lg leading-relaxed">
            I build AI and hardware systems that are practical, testable, and deployable. My workflow combines experimentation, system thinking,
            and iteration speed.
          </p>
          <p className="text-sm leading-relaxed text-gray-300">
            From thermoelectric prototypes to local AI pipelines, I bridge software and physical systems. I focus on useful outcomes, not just
            prototypes that look impressive.
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            <StatCard label="Focus Areas" value="AI + Hardware" />
            <StatCard label="Build Style" value="Rapid + Rigorous" />
            <StatCard label="Approach" value="Experiment Driven" />
          </div>
        </div>
      </div>
    );
  }

  if (stationId === 'projects') {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {PROJECTS.map((project) => (
          <article key={project.name} className="rounded-xl border border-space-neon/35 bg-space-dark/40 p-4 hover:border-space-neon transition-colors">
            <h3 className="text-space-neon font-semibold">{project.name}</h3>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">{project.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[11px] px-2 py-1 rounded bg-space-blue/70 text-sky-100 border border-space-neon/30">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (stationId === 'skills') {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-space-neon/45 bg-space-dark/45 p-5">
          <p className="text-space-neon text-xs uppercase tracking-[0.12em]">Selected Skill</p>
          <h3 className="text-3xl text-white orbitron mt-2">{activeSkill.name}</h3>
          <p className="text-sky-300 text-sm mt-2">{activeSkill.category}</p>
          <p className="text-gray-200 mt-4 leading-relaxed">{activeSkill.description}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {SKILLS.filter((skill) => skill.category === activeSkill.category).map((skill) => (
            <div key={skill.name} className="rounded-xl border border-space-neon/30 bg-space-blue/35 p-3">
              <p className="text-white text-sm font-semibold">{skill.name}</p>
              <p className="text-gray-300 text-xs mt-1">{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stationId === 'experience') {
    return (
      <div className="space-y-3">
        {EXPERIENCE.map((entry) => (
          <article key={entry.title} className="rounded-xl border border-space-neon/35 bg-space-dark/35 p-4">
            <h3 className="text-space-neon font-semibold">{entry.title}</h3>
            <p className="text-xs text-sky-300 mt-1">{entry.period}</p>
            <p className="text-sm text-gray-300 mt-2">{entry.description}</p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-200 leading-relaxed">
        Open a direct channel for collaboration, project opportunities, and technical discussion.
      </p>
      <div className="grid gap-3">
        {CONTACT_CHANNELS.map((channel) => {
          const Icon = channel.icon;
          return (
            <a
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-space-neon/40 bg-space-dark/45 p-4 hover:border-space-neon transition-colors flex items-center gap-3"
            >
              <Icon className="w-5 h-5 text-space-neon" />
              <div>
                <p className="text-white font-semibold">{channel.name}</p>
                <p className="text-sm text-gray-300">{channel.value}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-space-neon/40 bg-space-dark/40 p-4">
      <p className="text-xs text-sky-300 uppercase tracking-[0.12em]">{label}</p>
      <p className="text-white text-lg mt-2">{value}</p>
    </div>
  );
};

export default StationOverlay;
