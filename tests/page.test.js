const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const pageFiles = ['index.html', 'note.html'];
const pages = Object.fromEntries(pageFiles.map((file) => {
  const fullPath = path.join(root, file);
  return [file, fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : ''];
}));
const css = fs.readFileSync(path.join(root, 'app.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function motionCallsForHomePage(reducedMotion = false) {
  const calls = [];
  const heroArtImage = { name: 'hero-art-image' };
  const heroArt = { name: 'hero-art', querySelector: () => heroArtImage };
  const hero = {
    querySelectorAll: () => [{}, {}, {}, {}],
    querySelector: () => heroArt,
  };
  const musicButton = { querySelector: () => ({ textContent: '' }), addEventListener: () => {}, setAttribute: () => {} };
  const song = { paused: true, play: () => Promise.resolve(), pause: () => {} };
  const motion = {
    animate: (target, keyframes, options = {}) => calls.push({ target, keyframes, options }),
    stagger: (duration) => () => duration,
    hover: () => {},
  };
  const document = {
    querySelector: (selector) => selector === '#music-toggle' ? musicButton
      : selector === '#birthday-song' ? song
        : selector === '.hero' ? hero : null,
  };
  const window = { Motion: motion, matchMedia: () => ({ matches: reducedMotion }) };

  vm.runInNewContext(js, { document, window });
  return { calls, heroArt, heroArtImage };
}

function musicHarness(play) {
  const attributes = {};
  const musicLabel = { textContent: 'Play the birthday song' };
  const musicButton = {
    querySelector: () => musicLabel,
    addEventListener: () => {},
    setAttribute: (name, value) => { attributes[name] = value; },
  };
  const song = { paused: true, play, pause: () => {} };
  const document = {
    querySelector: (selector) => selector === '#music-toggle' ? musicButton
      : selector === '#birthday-song' ? song
        : null,
  };
  const window = { Motion: null, matchMedia: () => ({ matches: true }) };

  vm.runInNewContext(js, { document, window });
  return { attributes, musicLabel };
}

test('birthday greeting is split into two personalized pages', () => {
  for (const file of pageFiles) {
    assert.ok(fs.existsSync(path.join(root, file)), file + ' exists');
    assert.match(pages[file], /<title>[^<]*Aidil[^<]*<\/title>/i);
    assert.match(pages[file], /Aidil/i);
  }

  assert.match(pages['index.html'], /id="birthday-title"/i);
  assert.match(pages['note.html'], /id="note-title"/i);
  assert.match(pages['note.html'], /Make a wish/i);
  assert.equal(fs.existsSync(path.join(root, 'wish.html')), false);
});

test('both pages link to each other and mark the current page', () => {
  for (const file of pageFiles) {
    const html = pages[file];
    for (const target of pageFiles) {
      assert.match(html, new RegExp('href="' + target + '\\?v=9"'), file + ' links to ' + target);
    }
    assert.match(html, new RegExp('href="' + file + '\\?v=9"[^>]*aria-current="page"'));
  }
});

test('birthday artwork and song use local assets and request autoplay', () => {
  for (const file of pageFiles) {
    assert.match(pages[file], /<audio[^>]*src="hbd\.mp3"[^>]*autoplay/i, file + ' requests song autoplay');
  }
  assert.match(pages['index.html'], /src="aidil-birthday\.png(?:\?[^\"]*)?"/i);
  assert.ok(fs.statSync(path.join(root, 'aidil-birthday.png')).size > 1000);
  assert.ok(fs.statSync(path.join(root, 'hbd.mp3')).size > 1000);
});

test('starts the birthday song when the page opens', async () => {
  let playCalls = 0;
  const { attributes, musicLabel } = musicHarness(() => {
    playCalls += 1;
    return Promise.resolve();
  });

  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(playCalls, 1);
  assert.equal(attributes['aria-pressed'], 'true');
  assert.equal(attributes['aria-label'], 'Pause birthday song');
  assert.equal(musicLabel.textContent, 'Pause the birthday song');
});

test('keeps the play button available when browser autoplay is blocked', async () => {
  const { attributes, musicLabel } = musicHarness(() => Promise.reject(new Error('NotAllowedError')));

  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(attributes['aria-pressed'], 'false');
  assert.equal(attributes['aria-label'], 'Play birthday song');
  assert.equal(musicLabel.textContent, 'Tap to play the birthday song');
});

test('music and wish controls are accessible and Motion is pinned locally', () => {
  for (const file of pageFiles) {
    assert.match(pages[file], /id="music-toggle"[^>]*aria-label=/i);
    assert.match(pages[file], /<script src="vendor\/motion\.js" defer><\/script>/i);
    assert.doesNotMatch(pages[file], /<script[^>]+src="https?:\/\//i);
    assert.match(pages[file], /<script src="app\.js\?v=11" defer><\/script>/i);
  }
  assert.equal(packageJson.dependencies.motion, '14.5.0');
  assert.ok(fs.statSync(path.join(root, 'vendor', 'motion.js')).size > 1000);
  assert.match(pages['note.html'], /id="wish-button"/i);
  assert.match(pages['note.html'], /id="wish-status"[^>]*aria-live="polite"/i);
  assert.doesNotMatch(pages['index.html'], /id="wish-button"/i);
});

test('pages support dark mode, reduced motion, and plain visible text', () => {
  assert.match(css, /prefers-color-scheme:\s*dark/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(Object.values(pages).join('\n'), /Xola|[^\x00-\x7F]/i);
  assert.match(css, /--page:\s*#f2eff8/i);
  assert.match(css, /--accent:\s*#8063a6/i);
  assert.match(pages['index.html'], /lavender, violet, and plum frosting/i);
  assert.match(js, /song\.play\(\)/);
  assert.match(js, /wishStatus\.textContent/);
});

test('Motion animates the page and wish feedback while honoring reduced motion', () => {
  assert.match(js, /window\.Motion/);
  assert.match(js, /motion\.animate\(/);
  assert.match(js, /motion\.hover\(/);
  assert.match(js, /motion\.inView\(/);
  assert.match(js, /prefers-reduced-motion:\s*reduce/);
});

test('hero artwork keeps gently floating after the entrance animation', () => {
  const { calls, heroArt, heroArtImage } = motionCallsForHomePage();
  const entrance = calls.find((call) => call.target === heroArt && call.options.repeat === undefined);
  const float = calls.find((call) => call.target === heroArtImage && call.options.repeat === Infinity);

  assert.ok(entrance, 'the hero artwork has an entrance animation');
  assert.deepEqual(Array.from(entrance.keyframes.opacity), [0, 1]);
  assert.deepEqual(Array.from(entrance.keyframes.y), [28, 0]);
  assert.ok(entrance.options.duration >= 0.9);
  assert.ok(float, 'the hero artwork has a repeating Motion animation');
  assert.deepEqual(Array.from(float.keyframes.y), [0, -10, 0]);
  assert.ok(float.options.duration >= 4);
});

test('reduced motion preference skips the Motion animations', () => {
  const { calls } = motionCallsForHomePage(true);
  assert.equal(calls.length, 0);
});

test('dark colors stay muted and the mobile header keeps music beside the wordmark', () => {
  assert.match(css, /@media \(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{[^}]*--page:\s*#2c2735/i);
  assert.match(css, /@media \(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{[^}]*--accent:\s*#b7a2d9/i);
  assert.match(css, /@media \(max-width:\s*760px\)\s*\{[\s\S]*?\.music-toggle\s*\{[^}]*grid-area:\s*music;/i);
});
