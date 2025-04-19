# Startup Battle

![Startup Battle](https://img.shields.io/badge/Startup%20Battle-v3.7-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.x-38B2AC)

A retro-futuristic UI application for participating in startup battles, featuring CRT monitor effects, boot sequences, and interactive card battles with a retro computing aesthetic.

## 🚀 Features

- Authentic retro computer boot sequence animation
- Interactive UI with CRT monitor effects and scanlines
- Responsive design optimized for various screen sizes
- Background music and sound effects with toggling options
- Startup battle card game with attribute comparisons
- Pixel-perfect retro aesthetics with animations and particles
- Social sharing capabilities for battle results
- Accessibility features including keyboard navigation

## 🎮 Game Flow

1. **Boot Sequence**: Users are greeted with an authentic retro computer boot animation
2. **Main Menu**: After boot, users can access the main menu with options to play, view instructions, or adjust settings
3. **Startup Battle Game**: 
   - Select a startup card from the available options
   - Choose attributes to battle against the AI opponent
   - Win rounds by having higher attribute values 
   - Track scores and complete a full battle sequence
   - Share results on social media

## 🖥️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Audio Handling**: Custom hooks

## 🛠️ Setup and Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/startup-battle.git
cd startup-battle

# Install dependencies
npm install
# or
yarn install
```

### Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
# or
yarn build
```

## 📂 Project Structure

```
startup-battle/
├── app/              # Next.js app directory
│   ├── globals.css   # Global CSS styles
│   ├── play/         # Game play routes and battle logic
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page with boot sequence
├── components/       # Shared React components
│   ├── game/         # Game-specific components
│   │   ├── ui/       # Game UI components
│   │   └── ...       # Other game components
│   ├── page/         # Page-specific components
│   │   ├── BootSequence.tsx   # Boot animation component
│   │   ├── HowToPlay.tsx      # Instructions modal
│   │   └── MainContent.tsx    # Main menu content
│   └── ui/           # UI components (buttons, cards, etc.)
├── hooks/            # Custom React hooks
│   ├── useCRTEffects.ts       # CRT screen effects
│   ├── useBootSequence.ts     # Boot animation sequence
│   ├── useBackgroundMusic.ts  # Music and sound effects
│   └── ...           # Other utility hooks
├── lib/              # Utility functions and shared logic
│   ├── game-data.ts  # Startup card data
│   ├── game-utils.ts # Game utility functions
│   └── utils.ts      # General utility functions
├── public/           # Static assets
│   ├── music/        # Background music files
│   ├── sfx/          # Sound effects
│   └── images/       # Images and icons
└── styles/           # Additional styles
```

## 🧪 Code Quality Tools

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Radix UI](https://www.radix-ui.com/) - For accessible UI components
- [Framer Motion](https://www.framer.com/motion/) - For animations
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [Next.js](https://nextjs.org/) - For the React framework

