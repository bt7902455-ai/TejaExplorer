# Teja Space Portfolio

A modern, 3D space exploration themed personal portfolio website built with React, Vite, Tailwind CSS, and React Three Fiber.

## Features

- **3D Space Exploration**: Navigate through a futuristic space environment with your spaceship
- **Interactive Platforms**: Each platform represents a portfolio section (About, Projects, Skills, Experience, Contact)
- **Realistic Physics**: Smooth spaceship movement with damping and collision detection using Rapier physics engine
- **Futuristic UI**: Holographic-style interfaces with neon colors and scanline effects
- **Responsive Design**: Works on all devices with touch controls for mobile
- **Loading Screen**: Animated loading sequence with progress indicator
- **Controls**: 
  - Mouse: Drag to rotate camera, Scroll to zoom
  - Keyboard: WASD/Arrow keys for movement, Space to thrust, Shift to boost

## Technologies Used

- **React**: Frontend framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **React Three Fiber**: 3D rendering
- **@react-three/drei**: 3D utilities and components
- **@react-three/rapier**: Physics engine
- **Three.js**: 3D graphics library
- **Lucide React**: Icons
- **Orbitron Font**: Futuristic typography

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## File Structure

```
├── src/
│   ├── components/
│   │   ├── Background.jsx          # Starfield and nebulae background
│   │   ├── ContactSection.jsx      # Contact information
│   │   ├── Controls.jsx           # Control instructions modal
│   │   ├── ExperienceSection.jsx  # Experience and education
│   │   ├── LoadingScreen.jsx      # Loading animation
│   │   ├── Platform.jsx           # Floating platform component
│   │   ├── ProjectsSection.jsx    # Project showcase
│   │   ├── SkillsSection.jsx      # Technical skills
│   │   └── Spaceship.jsx          # Player-controlled spaceship
│   ├── App.jsx                    # Main application component
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Application entry point
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── vite.config.js                 # Vite configuration
```

## Customization

### Updating Content

- **About**: Edit `src/components/AboutSection.jsx`
- **Projects**: Edit `src/components/ProjectsSection.jsx`
- **Skills**: Edit `src/components/SkillsSection.jsx`
- **Experience**: Edit `src/components/ExperienceSection.jsx`
- **Contact**: Edit `src/components/ContactSection.jsx`

### Styling

- **Colors**: Modify in `src/index.css`
- **Fonts**: Change in `src/index.css` and `tailwind.config.js`
- **Holographic Effect**: Adjust in `src/index.css`

### Scene Configuration

- **Platform Positions**: Modify in `src/App.jsx`
- **Spaceship Properties**: Adjust in `src/components/Spaceship.jsx`
- **Background Settings**: Modify in `src/components/Background.jsx`

## Deployment

### Vercel Deployment

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Netlify Deployment

1. Connect your repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

## Performance Optimizations

- The project is optimized for performance using:
  - React Three Fiber's performance features
  - Tailwind CSS's purge functionality
  - Code splitting and lazy loading

## License

MIT