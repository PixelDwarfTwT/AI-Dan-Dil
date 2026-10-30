const musicButton = document.querySelector('#music-toggle');
const song = document.querySelector('#birthday-song');
const musicLabel = musicButton.querySelector('.music-label');
const wishButton = document.querySelector('#wish-button');
const wishStatus = document.querySelector('#wish-status');
const confetti = document.querySelector('#confetti');
const motion = window.Motion;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let confettiCleanup;

function setMusicState(isPlaying) {
  musicButton.setAttribute('aria-pressed', String(isPlaying));
  musicButton.setAttribute('aria-label', isPlaying ? 'Pause birthday song' : 'Play birthday song');
  musicLabel.textContent = isPlaying ? 'Pause the birthday song' : 'Play the birthday song';
}

async function startSong() {
  try {
    await song.play();
    setMusicState(true);
  } catch {
    setMusicState(false);
    musicLabel.textContent = 'Tap to play the birthday song';
  }
}

musicButton.addEventListener('click', async () => {
  if (song.paused) {
    await startSong();
    return;
  }

  song.pause();
  setMusicState(false);
});

startSong();

if (motion && !reduceMotion) {
  const hero = document.querySelector('.hero');
  if (hero) {
    const copy = hero.querySelectorAll('.eyebrow, h1, .hero-intro, .primary-link');
    motion.animate(
      copy,
      { opacity: [0, 1], y: [30, 0] },
      { delay: motion.stagger(0.12), duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    );
    const heroArt = hero.querySelector('.hero-art');
    motion.animate(
      heroArt,
      { opacity: [0, 1], scale: [0.93, 1], y: [28, 0] },
      { delay: 0.18, duration: 1.08, ease: [0.16, 1, 0.3, 1] },
    );
    motion.animate(
      heroArt.querySelector('img'),
      { y: [0, -10, 0], rotate: [0, 0.7, 0] },
      { delay: 1.3, duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
    );
  }

  const storyHeading = document.querySelector('.story-heading');
  const storyContent = document.querySelector('.story-content');
  if (storyHeading) {
    motion.animate(storyHeading, { opacity: [0, 1], y: [26, 0] }, { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
  }
  if (storyContent) {
    motion.animate(storyContent, { opacity: [0, 1], y: [28, 0] }, { delay: 0.16, duration: 1, ease: [0.16, 1, 0.3, 1] });
  }

  const wishPrompt = document.querySelector('.wish-prompt');
  if (wishPrompt) {
    motion.inView(wishPrompt, (element) => {
      motion.animate(element, { opacity: [0, 1], y: [20, 0] }, { duration: 0.72, ease: [0.16, 1, 0.3, 1] });
    }, { amount: 0.3 });
  }

  motion.hover('.primary-link, .wish-button', (element) => {
    motion.animate(element, { y: -4, scale: 1.03 }, { type: 'spring', stiffness: 420, damping: 28 });
    return () => motion.animate(element, { y: 0, scale: 1 }, { type: 'spring', stiffness: 420, damping: 28 });
  });
}

if (wishButton) {
  wishButton.addEventListener('click', () => {
    confetti.replaceChildren();
    wishStatus.textContent = 'Moga terkabul apapunn harapannmu itu.';

    if (confettiCleanup) window.clearTimeout(confettiCleanup);
    if (motion && !reduceMotion) {
      motion.animate(wishStatus, { opacity: [0.5, 1], y: [8, 0] }, { duration: 0.4, ease: [0.16, 1, 0.3, 1] });

      const colors = ['#8b70b2', '#b9a5d7', '#d9cfea', '#765b9c', '#c8b9de'];
      for (let index = 0; index < 20; index += 1) {
        const piece = document.createElement('span');
        const drift = Math.round((Math.random() - 0.5) * 130);
        const rise = 150 + Math.random() * 70;
        const spin = Math.round(Math.random() * 440 - 220);
        piece.className = 'confetti-bit';
        piece.style.setProperty('--x', String(8 + Math.random() * 84) + '%');
        piece.style.setProperty('--size', String(5 + Math.random() * 5) + 'px');
        piece.style.setProperty('--color', colors[index % colors.length]);
        confetti.append(piece);

        motion.animate(
          piece,
          { opacity: [0, 1, 0], y: [12, -rise], x: drift, rotate: [0, spin], scale: [0.75, 1, 0.8] },
          { delay: index * 0.016, duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        );
      }

      confettiCleanup = window.setTimeout(() => confetti.replaceChildren(), 1400);
    }
  });
}
