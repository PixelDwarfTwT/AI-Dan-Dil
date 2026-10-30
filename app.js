const musicButton = document.querySelector('#music-toggle');
const song = document.querySelector('#birthday-song');
const musicLabel = musicButton.querySelector('.music-label');
const wishButton = document.querySelector('#wish-button');
const wishStatus = document.querySelector('#wish-status');
const confetti = document.querySelector('#confetti');

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

if (wishButton) {
  wishButton.addEventListener('click', () => {
    confetti.replaceChildren();
    wishStatus.textContent = 'Wish made, Aidil. Hope it comes true.';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const colors = ['#b3bd9d', '#c9b5aa', '#e1dfd4', '#aab39d', '#d4cec1'];
    for (let index = 0; index < 24; index += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-bit';
      piece.style.setProperty('--x', `${8 + Math.random() * 84}%`);
      piece.style.setProperty('--size', `${5 + Math.random() * 5}px`);
      piece.style.setProperty('--color', colors[index % colors.length]);
      piece.style.setProperty('--drift', `${Math.round((Math.random() - 0.5) * 150)}px`);
      piece.style.setProperty('--spin', `${Math.round(Math.random() * 520 - 260)}deg`);
      confetti.append(piece);
    }

    window.setTimeout(() => confetti.replaceChildren(), 1300);
  });
}
