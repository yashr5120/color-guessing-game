// State
let state = {
    targetH: 0, targetS: 0, targetL: 0,
    guessH: 180, guessS: 50, guessL: 50,
    streak: 0,
    score: 0
};

// DOM Elements
const els = {
    phases: {
        landing: document.getElementById('phase-landing'),
        memorize: document.getElementById('phase-memorize'),
        guess: document.getElementById('phase-guess'),
        result: document.getElementById('phase-result')
    },
    sliders: {
        h: document.getElementById('slider-h'),
        s: document.getElementById('slider-s'),
        l: document.getElementById('slider-l')
    },
    values: {
        h: document.getElementById('val-h'),
        s: document.getElementById('val-s'),
        l: document.getElementById('val-l')
    },
    displays: {
        livePreview: document.getElementById('live-preview'),
        targetFullscreen: document.getElementById('target-color-display'),
        dynamicBg: document.getElementById('dynamic-bg'),
        streakCounter: document.getElementById('streak-counter'),
        countdownNum: document.getElementById('countdown-number'),
        finalScore: document.getElementById('final-score'),
        feedbackHeading: document.getElementById('feedback-heading'),
        feedbackSub: document.getElementById('feedback-subtext'),
        compTarget: document.getElementById('result-target-color'),
        compGuess: document.getElementById('result-guess-color'),
        circleProgress: document.querySelector('.circle')
    },
    btns: {
        start: document.getElementById('btn-start'),
        submit: document.getElementById('btn-submit'),
        replay: document.getElementById('btn-replay')
    }
};

// Utils
const hslToRgb = (h, s, l) => {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
};

const getPerceptualDistance = (rgb1, rgb2) => {
    return Math.sqrt(
        Math.pow(rgb1[0] - rgb2[0], 2) + 
        Math.pow(rgb1[1] - rgb2[1], 2) + 
        Math.pow(rgb1[2] - rgb2[2], 2)
    );
};

// Transitions
function transitionTo(phaseId, onComplete) {
    const currentActive = document.querySelector('.phase.active');
    const nextPhase = els.phases[phaseId];

    if(currentActive === nextPhase) return;

    gsap.to(currentActive, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
            currentActive.classList.remove('active');
            currentActive.style.display = 'none';
            
            nextPhase.style.display = 'flex';
            gsap.fromTo(nextPhase, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", onComplete }
            );
            nextPhase.classList.add('active');
        }
    });
}

// Game Flow
function startGame() {
    // Hide ambient lights for focus
    gsap.to('.ambient-light', { opacity: 0, duration: 1 });

    // Generate Target
    state.targetH = Math.floor(Math.random() * 360);
    state.targetS = Math.floor(Math.random() * 60) + 40; // 40-100%
    state.targetL = Math.floor(Math.random() * 60) + 20; // 20-80%

    // Reset Guess Sliders
    state.guessH = 180; state.guessS = 50; state.guessL = 50;
    els.sliders.h.value = state.guessH;
    els.sliders.s.value = state.guessS;
    els.sliders.l.value = state.guessL;
    updatePreview();

    // Prepare memorize phase
    els.displays.targetFullscreen.style.background = `hsl(${state.targetH}, ${state.targetS}%, ${state.targetL}%)`;
    els.displays.targetFullscreen.style.opacity = 0;

    transitionTo('memorize', () => {
        // Flood screen
        gsap.to(els.displays.targetFullscreen, { opacity: 1, duration: 0.8, ease: "power2.out" });
        
        // Countdown
        let count = 5;
        els.displays.countdownNum.innerText = count;
        
        const countdownInterval = setInterval(() => {
            count--;
            
            if (count > 0) {
                // Animate number change
                gsap.fromTo(els.displays.countdownNum, 
                    { scale: 1.5, opacity: 0 }, 
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                );
                els.displays.countdownNum.innerText = count;
            } else {
                clearInterval(countdownInterval);
                // Hide color and transition to guess
                gsap.to(els.displays.targetFullscreen, { 
                    opacity: 0, 
                    duration: 0.6, 
                    onComplete: () => transitionTo('guess', initGuessPhase) 
                });
            }
        }, 1000);
    });
}

function initGuessPhase() {
    // Animate card entrance if needed
    gsap.fromTo('.main-controls', 
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "expo.out" }
    );
}

function updatePreview() {
    state.guessH = els.sliders.h.value;
    state.guessS = els.sliders.s.value;
    state.guessL = els.sliders.l.value;

    els.values.h.innerText = `${state.guessH}°`;
    els.values.s.innerText = `${state.guessS}%`;
    els.values.l.innerText = `${state.guessL}%`;

    const currentColor = `hsl(${state.guessH}, ${state.guessS}%, ${state.guessL}%)`;
    
    // Update live preview bubble
    els.displays.livePreview.style.background = currentColor;

    // Update dynamic background with a dark radial gradient using the color
    els.displays.dynamicBg.style.background = `radial-gradient(circle at center, hsla(${state.guessH}, ${state.guessS}%, ${state.guessL}%, 0.15) 0%, var(--bg-base) 100%)`;

    // Update slider track backgrounds for S and L
    updateSliderTracks(state.guessH, state.guessS, state.guessL);
}

let styleEl = document.getElementById('dynamic-slider-styles');
if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamic-slider-styles';
    document.head.appendChild(styleEl);
}

function updateSliderTracks(h, s, l) {
    styleEl.innerHTML = `
        .slider-sat::-webkit-slider-runnable-track {
            background: linear-gradient(to right, hsl(${h}, 0%, ${l}%), hsl(${h}, 100%, ${l}%)) !important;
        }
        .slider-lum::-webkit-slider-runnable-track {
            background: linear-gradient(to right, hsl(${h}, ${s}%, 0%), hsl(${h}, ${s}%, 50%), hsl(${h}, ${s}%, 100%)) !important;
        }
    `;
}

function calculateScore() {
    const targetRGB = hslToRgb(state.targetH, state.targetS, state.targetL);
    const guessRGB = hslToRgb(state.guessH, state.guessS, state.guessL);
    
    const maxDist = Math.sqrt(255**2 * 3);
    const dist = getPerceptualDistance(targetRGB, guessRGB);
    
    let rawScore = Math.max(0, (1 - (dist / maxDist)) * 100);
    return rawScore;
}

function submitGuess() {
    const score = calculateScore();
    state.score = parseFloat(score.toFixed(1));

    // Update Streak
    if (state.score >= 90) {
        state.streak++;
        // Confetti for streak
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fff', '#ff3366', '#00f2fe']
        });
    } else {
        state.streak = 0;
    }
    els.displays.streakCounter.innerText = state.streak;

    // Set Result UI
    els.displays.compTarget.style.background = `hsl(${state.targetH}, ${state.targetS}%, ${state.targetL}%)`;
    els.displays.compGuess.style.background = `hsl(${state.guessH}, ${state.guessS}%, ${state.guessL}%)`;

    // Feedback logic
    let heading = "", sub = "", color = "";
    if (state.score >= 95) { heading = "Flawless"; sub = "Absolute perfection."; color = "#00e676"; }
    else if (state.score >= 85) { heading = "Excellent"; sub = "You have a great eye."; color = "#00b0ff"; }
    else if (state.score >= 70) { heading = "Good"; sub = "Close, but needs fine-tuning."; color = "#ffea00"; }
    else { heading = "Off Mark"; sub = "Keep practicing your perception."; color = "#ff1744"; }

    els.displays.feedbackHeading.innerText = heading;
    els.displays.feedbackHeading.style.color = color;
    els.displays.feedbackSub.innerText = sub;
    
    // Circle SVG Color
    els.displays.circleProgress.style.stroke = color;

    transitionTo('result', () => {
        // Animate Score Counter
        let dummy = { val: 0 };
        gsap.to(dummy, {
            val: state.score,
            duration: 1.5,
            ease: "power3.out",
            onUpdate: () => {
                els.displays.finalScore.innerText = dummy.val.toFixed(1);
                // Update SVG circle dasharray
                const progress = dummy.val;
                els.displays.circleProgress.setAttribute('stroke-dasharray', `${progress}, 100`);
            }
        });

        // Stagger comparison cards
        gsap.fromTo('.comp-card', 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: "back.out(1.5)" }
        );
    });
}

// Event Listeners
els.btns.start.addEventListener('click', startGame);
els.btns.submit.addEventListener('click', submitGuess);
els.btns.replay.addEventListener('click', startGame);

['h', 's', 'l'].forEach(key => {
    els.sliders[key].addEventListener('input', updatePreview);
});

// Magnetic Button Effect for Hero
const magnetBtn = document.querySelector('.magnetic');
magnetBtn.addEventListener('mousemove', (e) => {
    const rect = magnetBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(magnetBtn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
    });
});

magnetBtn.addEventListener('mouseleave', () => {
    gsap.to(magnetBtn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
});

// Init Landing Animation
window.addEventListener('DOMContentLoaded', () => {
    // Initial Preview setup
    updatePreview();
    
    gsap.fromTo('.hero-title', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo('.hero-subtitle', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
    );
    gsap.fromTo('.btn-primary', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6 }
    );
    gsap.fromTo('.demo-card', 
        { x: 50, opacity: 0, rotateY: 0 }, 
        { x: 0, opacity: 1, rotateY: -15, duration: 1.5, ease: 'power3.out', delay: 0.5 }
    );
});