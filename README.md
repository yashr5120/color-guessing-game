# Chroma: Visual Perception Game 🎨

![Chroma Preview](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

Chroma is a premium, interactive web application designed to test and refine your color perception skills. Inspired by modern, Apple-esque design principles, the application offers an elegant glassmorphism UI, buttery-smooth GSAP animations, and engaging gameplay.

## ✨ Features

- **Premium UI/UX:** Clean, minimalistic glassmorphism design with magnetic button interactions and animated mesh backgrounds.
- **Cinematic Animations:** Powered by GSAP, featuring smooth transitions, staggered card reveals, and dynamic elements.
- **Real-Time Visual Feedback:** HSL (Hue, Saturation, Lightness) sliders update seamlessly with live previews.
- **Combo System:** Rewards accuracy with streak multipliers and particle confetti effects.
- **Perceptual Distance Scoring:** Accurate RGB-based distance calculation to determine how close your guess is to the target color.
- **Responsive Design:** Optimized layout that looks stunning on desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

- **Frontend:**
  - HTML5 (Semantic Structure)
  - CSS3 (Variables, Custom Properties, Glassmorphism, Responsive Media Queries)
  - JavaScript (Vanilla ES6+)
  - [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) - For premium animations
  - [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) - For visual rewards
- **Backend:**
  - Python 3
  - [Flask](https://flask.palletsprojects.com/) - Lightweight WSGI web application framework
- **Typography:**
  - Inter & Outfit (Google Fonts)

## 🚀 Getting Started

### Prerequisites
Make sure you have Python installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yashr5120/color-guessing-game.git
   cd color-guessing-game
   ```

2. **Install dependencies:**
   ```bash
   pip install flask
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Play the game:**
   Open your browser and navigate to `http://127.0.0.1:5000`

## 🎮 How to Play

1. **Memorize:** A target color will fill the screen for 5 seconds. Remember its exact Hue, Saturation, and Lightness.
2. **Recreate:** Use the custom sliders to recreate the exact color you saw.
3. **Evaluate:** Submit your guess to see your perceptual distance score.
4. **Streak:** Score 90% or higher to build your combo streak and earn rewards!

## 📄 License

This project is open-source and available under the MIT License.
