const musicButton = document.querySelector('#music-toggle');
const song = document.querySelector('#birthday-song');
const musicLabel = musicButton.querySelector('.music-label');
const wishButton = document.querySelector('#wish-button');
const wishStatus = document.querySelector('#wish-status');
const confetti = document.querySelector('#confetti');
const motion = window.Motion;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let confettiCleanup;

musicButton.addEventListener('click', async () => {
  if (song.paused) {
    try {
      await song.play();
      musicButton.setAttribute('aria-pressed', 'true');
      musicButton.setAttribute('aria-label', 'Pause birthday song');
      musicLabel.textContent = 'Pause the birthday song';
    } catch {
      musicButton.setAttribute('aria-pressed', 'false');
      musicButton.setAttribute('aria-label', 'Play birthday song');
      musicLabel.textContent = 'Song could not start. Try again';
    }
    return;
  }

  song.pause();
  musicButton.setAttribute('aria-pressed', 'false');
  musicButton.setAttribute('aria-label', 'Play birthday song');
  musicLabel.textContent = 'Play the birthday song';
});

if (motion && !reduceMotion) {
  const hero = document.querySelector('.hero');
  if (hero) {
    const copy = hero.querySelectorAll('.eyebrow, h1, .hero-intro, .primary-link');
    motion.animate(
      copy,
      { opacity: [0.72, 1], y: [12, 0] },
      { delay: motion.stagger(0.075), duration: 0.62, ease: [0.16, 1, 0.3, 1] },
    );
    motion.animate(
      hero.querySelector('.hero-art'),
      { opacity: [0.82, 1], scale: [0.985, 1], y: [8, 0] },
      { delay: 0.12, duration: 0.82, ease: [0.16, 1, 0.3, 1] },
    );
  }

  const storyHeading = document.querySelector('.story-heading');
  const storyContent = document.querySelector('.story-content');
  if (storyHeading) {
    motion.animate(storyHeading, { opacity: [0.72, 1], y: [12, 0] }, { duration: 0.58, ease: [0.16, 1, 0.3, 1] });
  }
  if (storyContent) {
    motion.animate(storyContent, { opacity: [0.72, 1], y: [14, 0] }, { delay: 0.08, duration: 0.66, ease: [0.16, 1, 0.3, 1] });
  }

  const wishPrompt = document.querySelector('.wish-prompt');
  if (wishPrompt) {
    motion.inView(wishPrompt, (element) => {
      motion.animate(element, { opacity: [0.78, 1], y: [10, 0] }, { duration: 0.48, ease: [0.16, 1, 0.3, 1] });
    }, { amount: 0.3 });
  }

  motion.hover('.primary-link, .wish-button', (element) => {
    motion.animate(element, { y: -2, scale: 1.015 }, { type: 'spring', stiffness: 420, damping: 28 });
    return () => motion.animate(element, { y: 0, scale: 1 }, { type: 'spring', stiffness: 420, damping: 28 });
  });
}

if (wishButton) {
  wishButton.addEventListener('click', () => {
    confetti.replaceChildren();
    wishStatus.textContent = 'Wish made, Aidil. Hope it comes true.';

    if (confettiCleanup) window.clearTimeout(confettiCleanup);
    if (motion && !reduceMotion) {
      motion.animate(wishStatus, { opacity: [0.5, 1], y: [8, 0] }, { duration: 0.4, ease: [0.16, 1, 0.3, 1] });

      const colors = ['#b3bd9d', '#c9b5aa', '#e1dfd4', '#aab39d', '#d4cec1'];
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
