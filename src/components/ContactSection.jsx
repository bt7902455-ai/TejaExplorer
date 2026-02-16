import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

const ContactSection = () => {
  return (
    <div className="holographic p-6 rounded-2xl max-w-md scanlines">
      <h2 className="text-2xl font-bold text-white orbitron mb-4 glow">
        CONTACT ME
      </h2>
      <p className="text-gray-300 mb-6">
        I am always interested in collaborating on exciting projects, discussing
        innovative ideas, or exploring new possibilities in tech.
      </p>

      <div className="space-y-4">
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=mvsivateja@proton.me"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-3 bg-space-blue/50 rounded-lg hover:bg-space-blue/70 transition-all duration-300 group"
        >
          <Mail className="w-5 h-5 text-space-neon group-hover:scale-110 transition-transform duration-300" />
          <div>
            <h4 className="text-white font-semibold">Email</h4>
            <p className="text-gray-400 text-sm">mvsivateja@proton.me</p>
          </div>
        </a>

        <a
          href="https://github.com/VSTM26"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-3 bg-space-blue/50 rounded-lg hover:bg-space-blue/70 transition-all duration-300 group"
        >
          <Github className="w-5 h-5 text-space-neon group-hover:scale-110 transition-transform duration-300" />
          <div>
            <h4 className="text-white font-semibold">GitHub</h4>
            <p className="text-gray-400 text-sm">github.com/VSTM26</p>
          </div>
        </a>

        <a
          href="https://www.linkedin.com/in/teja-mathukumalli/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-3 bg-space-blue/50 rounded-lg hover:bg-space-blue/70 transition-all duration-300 group"
        >
          <Linkedin className="w-5 h-5 text-space-neon group-hover:scale-110 transition-transform duration-300" />
          <div>
            <h4 className="text-white font-semibold">LinkedIn</h4>
            <p className="text-gray-400 text-sm">linkedin.com/in/teja-mathukumalli</p>
          </div>
        </a>
      </div>

      <div className="mt-6 pt-4 border-t border-space-neon/30">
        <p className="text-gray-400 text-sm text-center">
          (c) 2025 Teja Mathukumalli. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ContactSection;
