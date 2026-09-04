<div align="center">

# 💪 AI Fitness Coach

**Next-Gen Fitness Assistant · Personalized LLM Coaching · Voice Integration**

An advanced AI-powered fitness assistant built with **Next.js 14**, engineered to generate highly personalized, dynamic 7-day workout and diet plans utilizing Large Language Models via OpenRouter.

[![GitHub Stars](https://img.shields.io/github/stars/deepakparagi/ai-fitness-coach?style=for-the-badge&logo=github&color=yellow)](https://github.com/deepakparagi/ai-fitness-coach/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/deepakparagi/ai-fitness-coach?style=for-the-badge&logo=github&color=blue)](https://github.com/deepakparagi/ai-fitness-coach/network)
[![GitHub Issues](https://img.shields.io/github/issues/deepakparagi/ai-fitness-coach?style=for-the-badge&logo=github&color=red)](https://github.com/deepakparagi/ai-fitness-coach/issues)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14.2.0-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI_API-4.x-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.2-FF0050?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)

<br/>

[**Report Bug**](https://github.com/deepakparagi/ai-fitness-coach/issues/new?labels=bug&template=bug_report.md)&nbsp;&nbsp;•&nbsp;&nbsp;[**Request Feature**](https://github.com/deepakparagi/ai-fitness-coach/issues/new?labels=enhancement&template=feature_request.md)

</div>

---

## 📌 About

This platform reimagines personal fitness coaching by integrating cutting-edge AI technologies directly into a web interface. By leveraging powerful LLMs via OpenRouter, it instantly generates comprehensive 7-day workout routines and nutrition guidelines tailored specifically to user preferences and goals.

The application goes beyond simple text generation by incorporating Web Speech API for voice playback, dynamic AI image generation via Pollinations.ai to visualize exercises and meals, and seamless PDF exporting—providing a complete, premium coaching experience wrapped in a beautiful, responsive dark/light mode UI.

---

## ✨ Key Features

| Feature | Description |
|:---|:---|
| 🧠 **AI-Powered Plans** | Intelligent generation of personalized 7-day workout routines with detailed exercise mechanics |
| 🥗 **Custom Nutrition** | Dynamic diet plans matching specific dietary preferences (Veg/Non-Veg/Vegan/Keto) |
| 🔊 **Voice Playback** | Auditory guidance using the browser's native Text-to-Speech API for hands-free training |
| 🖼️ **AI Image Generation** | Visual representations of specific exercises and meal plans generated dynamically |
| 📄 **PDF Export** | Downloadable comprehensive fitness plans via jsPDF integration |
| 🌗 **Dark / Light Mode** | Beautiful, fluid theme system that respects system preferences |
| 💾 **Persistent State** | Automatic saving of generated plans to local storage for quick access |
| 📱 **Responsive Design** | Flawless execution across mobile, tablet, and desktop viewports |

---

## 🛠️ Tech Stack

### Core

| Layer | Technology |
|:---|:---|
| **Framework** | Next.js 14 (App Router) |
| **UI Library** | React 18 |
| **Language** | TypeScript |

### Styling & Animation

| Tool | Purpose |
|:---|:---|
| **Tailwind CSS 3** | Utility-first responsive styling |
| **Framer Motion** | Micro-interactions and fluid page transitions |
| **Lucide React** | Consistent, crisp iconography |

### Integrations & APIs

| Library | Purpose |
|:---|:---|
| **OpenRouter API** | Core LLM engine routing (GPT-4o-mini capabilities) |
| **Pollinations.ai** | Free, dynamic AI image generation endpoints |
| **Web Speech API** | Native browser text-to-speech capabilities |
| **jsPDF** | Client-side PDF document generation |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **OpenRouter API Key** (Free tier available at [OpenRouter](https://openrouter.ai/keys))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/deepakparagi/ai-fitness-coach.git

# 2. Navigate into the project
cd ai-fitness-coach

# 3. Install dependencies
npm install

# 4. Configure environment variables
# Create a .env.local file in the root
echo "OPENROUTER_API_KEY=your_openrouter_api_key_here" > .env.local

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 📋 Available Scripts

| Script | Command | Description |
|:---|:---|:---|
| **Dev Server** | `npm run dev` | Starts the Next.js development server |
| **Build** | `npm run build` | Creates an optimized production build |
| **Start** | `npm run start` | Serves the production build locally |
| **Lint** | `npm run lint` | Runs Next.js ESLint for code quality checks |

---

## 📁 Project Structure

```
ai-fitness-coach/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # Serverless API Routes
│   │   │   ├── generate-plan/
│   │   │   ├── generate-image/
│   │   │   └── text-to-speech/
│   │   ├── layout.tsx      # Global layout wrapper
│   │   ├── page.tsx        # Application entry point
│   │   └── globals.css     # Global styles and Tailwind directives
│   │
│   ├── components/         # Reusable React components
│   │   ├── Navbar.tsx      # Navigation interface
│   │   ├── Hero.tsx        # Landing page hero section
│   │   ├── Features.tsx    # Feature highlights
│   │   ├── UserForm.tsx    # Multi-step data collection
│   │   ├── PlanDisplay.tsx # Results visualization
│   │   ├── VoicePlayer.tsx # TTS controls
│   │   └── Footer.tsx      # Application footer
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── useLocalStorage.ts
│   │
│   └── lib/                # Shared utilities
│       └── types.ts        # Global TypeScript interfaces
│
├── package.json            # Dependencies & scripts
└── README.md               # 👈 You are here
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "feat: add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 🔗 Connect

<div align="center">

[![Developed By DeepCipher Agency](https://img.shields.io/badge/Developed_By-DeepCipher_Agency-111111?style=for-the-badge)](#)
[![Email](https://img.shields.io/badge/Email-deepakparagi03%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:deepakparagi03@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Deepak_Paragi-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/deepak-paragi-501140261/)
[![Twitter](https://img.shields.io/badge/X_(Twitter)-@Deepak__Paragi-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/Deepak_Paragi)
[![GitHub](https://img.shields.io/badge/GitHub-deepakparagi-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/deepakparagi)

</div>

---

<div align="center">

### ⭐ Star this repo if you found it useful!

**© 2026 Deepak Paragi. All rights reserved.**

Designed & Developed by **DeepCipher Agency**.

</div>
