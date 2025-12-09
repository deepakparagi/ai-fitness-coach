# 💪 AI Fitness Coach

An AI-powered fitness assistant built with Next.js that generates personalized workout and diet plans using LLMs.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## ✨ Features

- 🧠 **AI-Powered Plans** - Personalized 7-day workout routines with detailed exercises
- 🥗 **Custom Nutrition** - Diet plans matching your dietary preferences (Veg/Non-Veg/Vegan/Keto)
- 🔊 **Voice Playback** - Listen to your plans with browser text-to-speech
- 🖼️ **AI Image Generation** - Visual representations of exercises and meals
- 📄 **PDF Export** - Download your complete fitness plan
- 🌗 **Dark/Light Mode** - Beautiful UI with theme support
- 💾 **Local Storage** - Plans saved automatically
- 📱 **Fully Responsive** - Works on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- OpenRouter API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/deepakparagi/ai-fitness-coach.git
cd ai-fitness-coach
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys

Get your free OpenRouter API key from: https://openrouter.ai/keys

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: OpenRouter API (GPT-4o-mini)
- **Images**: Pollinations.ai (free AI image generation)
- **Voice**: Web Speech API (browser built-in)
- **PDF**: jsPDF

## 📁 Project Structure

```
ai-fitness-coach/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-plan/
│   │   │   ├── generate-image/
│   │   │   └── text-to-speech/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── UserForm.tsx
│   │   ├── PlanDisplay.tsx
│   │   ├── ImageModal.tsx
│   │   ├── VoicePlayer.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   └── lib/
│       └── types.ts
├── package.json
└── README.md
```

## 📝 License

MIT License - feel free to use this project for learning or personal use.

## 🙏 Acknowledgments

- OpenRouter for AI API access
- Pollinations.ai for free image generation
- Unsplash for fallback images
