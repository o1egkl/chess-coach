# Chess Coach — Educational Chess Platform (400–2420+ Elo)

🌍 **Language / Язык / Dil**: [English](README.md) | [Русский](README.ru.md) | [Türkçe](README.tr.md)

Cross-platform educational chess application (**Web, Windows Desktop & Android**) built with **React 18, TypeScript, Tailwind CSS, Chessground, and Stockfish 16 WASM**.

---

## 🌟 Key Features

### 1. 15 Adaptive Difficulty Levels (400 — 2420+ Elo)
* **Beginners (Levels 1–5, 400–1000 Elo)**: Probabilistic suboptimal move selection with `MultiPV 3–5`, simulated blunders, and educational guidance.
* **Club Players (Levels 6–10, 1150–1750 Elo)**: Balanced play via Stockfish parameters `UCI_LimitStrength` and calibrated `UCI_Elo`.
* **Masters (Levels 11–15, 1900–2420+ Elo)**: Full Stockfish calculation depth (20+ ply) with tactical sharpness and positional punishment.

### 2. Interactive Coach System
* **Two-Stage Progressive Hints**:
  1. *Nudge*: Highlights the relevant piece and general tactical area.
  2. *Solution*: Draws an exact green arrow indicating the engine's best move.
* **Threat Radar (Heatmap)**: Live visual highlighting of attacked squares, threatened pieces, and undefended friendly/opponent material.
* **Blunder Shield**: Atomic evaluation safeguard that intercepts fatal mistakes, plays an alert sound, displays a warning banner, and delays the bot's response to give the player time to take back.
* **ECO Opening Classifier**: Real-time identification of opening variations with educational descriptions.

### 3. Post-Game Analysis & Mistake Drill
* Full retrospective move-by-move engine analysis with Centipawn Loss ($\Delta$ cp).
* Move quality classification: Brilliant (`!!`), Best (`!`), Book (`book`), Inaccuracy (`?!`), Mistake (`?`), Blunder (`??`).
* Player vs. bot accuracy scoring (0–100%).
* Interactive advantage curve with one-click navigation to any ply.
* **Mistake Drill**: Interactive retry mode allowing players to replay positions where blunders or mistakes occurred.

### 4. Tactical Puzzle Trainer
* Curated tactical puzzle collection (Knight Fork, Back-Rank Mate, Absolute Pin, Smothered Mate, Deflection, Discovered Check, Skewer, Legall's Mate).
* All puzzles are 100% verified with `chess.js` for legal moves and accurate tactical themes.
* Winning streak counter, tactics rating progression, and confetti/sound celebrations.

### 5. Multilingual Support
* Complete UI, bot profiles, tactical descriptions, and coach heuristics translated into **English**, **Russian**, and **Turkish**.

### 6. Player Profile & Local Progress
* Dynamic FIDE-style Elo calculation.
* 15-bot unlock progression and win tracking.
* Elo rating history chart.
* Persistent offline storage via `LocalStorage`.

---

## 🚀 Platforms & Downloads

* **Web Version**: Deployed live on [Vercel Production](https://chess-coach-ochre-tau.vercel.app).
* **Android APK / AAB**: Native mobile application powered by **Capacitor 8** with embedded **Stockfish 16 WASM (100% offline, zero network required)**.
* **Windows Desktop (.exe)**: Packaged via **Electron** with NSIS installer and portable executable.
* **Automated CI/CD**:
  - Every push to the `main` branch automatically triggers GitHub Actions (`.github/workflows/android-build.yml`).
  - Automatically compiles both the Android APK (`chess-coach-latest.apk`) and Windows binary (`Chess Coach Setup.exe`).
  - Pre-built artifacts and releases are always available on the [Releases](https://github.com/o1egkl/chess-coach/releases) page.

---

## 📱 Installation Guide

### Android
1. Go to the [GitHub Releases](https://github.com/o1egkl/chess-coach/releases) page.
2. Under **Assets**, download **`chess-coach-latest.apk`**.
3. Open the APK file on your Android device and confirm installation.
4. Enjoy 100% offline chess with full engine coaching!

### Windows Desktop
1. Download **`Chess Coach Setup.exe`** from [GitHub Releases](https://github.com/o1egkl/chess-coach/releases).
2. Run the installer or use the portable executable.
3. Launch Chess Coach directly from your desktop.

---

## 🛠️ Local Development & Build

### Prerequisites
* Node.js $\ge 18$ (Node 22 recommended)
* npm $\ge 9$
* Android Studio / JDK 17 (only required for local Android compilation)

### Setup & Run

```bash
# Clone the repository
git clone https://github.com/o1egkl/chess-coach.git
cd chess-coach

# Install dependencies
npm install

# Run Vite development server
npm run dev

# Run puzzle rule validation test
node scripts/validate_puzzles.cjs

# Build web distribution
npm run build

# Run Electron desktop app in development
npm run electron:dev

# Build Windows installer & portable binary
npm run electron:build

# Sync web assets to Capacitor Android project
npx cap sync android
```

---

## 🏷️ Releasing New Versions

To create a new version tag and automatically publish release assets via GitHub Actions:

```bash
# Patch release (e.g. 1.0.0 -> 1.0.1)
npm run release:patch

# Minor release (e.g. 1.0.0 -> 1.1.0)
npm run release:minor

# Major release (e.g. 1.0.0 -> 2.0.0)
npm run release:major
```

---

## 📂 Project Architecture

```text
chess-coach/
├── .github/workflows/        # Automated CI/CD pipeline for Android & Windows
├── android/                  # Native Capacitor Android project
├── electron/                 # Electron main process & desktop entry point
├── public/
│   ├── stockfish/            # Stockfish 16 WASM & Web Worker scripts
│   ├── chess-icon.svg        # Application branding icon
│   ├── manifest.json         # PWA configuration
│   └── sw.js                 # Offline Service Worker precache
├── scripts/
│   └── validate_puzzles.cjs  # Automated puzzle legality test suite
├── src/
│   ├── components/           # UI components (Board, Coach, Modals, Puzzles, Charts)
│   ├── config/               # Bot levels, tactical puzzles, opening book
│   ├── context/              # LanguageContext & theme state
│   ├── engine/               # Stockfish controller, coach heuristics, sound engine
│   ├── i18n/                 # Localization dictionaries (RU, EN, TR)
│   ├── services/             # Storage & player profile service
│   ├── types/                # TypeScript interfaces and game types
│   ├── App.tsx               # Root application view & state manager
│   └── main.tsx              # React DOM entry point
├── package.json
└── vite.config.ts
```

---

## 📄 License

MIT License. Open-source educational project. Stockfish engine is licensed under GPLv3.
