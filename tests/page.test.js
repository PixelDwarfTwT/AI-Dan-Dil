const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pageFiles = ['index.html', 'note.html', 'wish.html'];
const pages = Object.fromEntries(pageFiles.map((file) => {
  const fullPath = path.join(root, file);
  return [file, fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : ''];
}));
const css = fs.readFileSync(path.join(root, 'app.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

test('birthday greeting is split into three personalized pages', () => {
  for (const file of pageFiles) {
    assert.ok(fs.existsSync(path.join(root, file)), file + ' exists');
    assert.match(pages[file], /<title>[^<]*Aidil[^<]*<\/title>/i);
    assert.match(pages[file], /Aidil/i);
  }

  assert.match(pages['index.html'], /Today is your day/i);
  assert.match(pages['note.html'], /A note for you/i);
  assert.match(pages['wish.html'], /Make a wish/i);
});

test('every page has working navigation and marks the current page', () => {
  for (const file of pageFiles) {
    const html = pages[file];
    for (const target of pageFiles) {
      assert.match(html, new RegExp('href="' + target + '\\?v=4"'), file + ' links to ' + target);
    }
    assert.match(html, new RegExp('href="' + file + '\\?v=4"[^>]*aria-current="page"'));
  }
});

test('birthday artwork and song use local assets', () => {
  for (const file of pageFiles) assert.match(pages[file], /src="hbd\.mp3"/i);
  for (const file of ['index.html', 'wish.html']) {
    assert.match(pages[file], /src="aidil-birthday\.png(?:\?[^\"]*)?"/i);
  }
  assert.ok(fs.statSync(path.join(root, 'aidil-birthday.png')).size > 1000);
  assert.ok(fs.statSync(path.join(root, 'hbd.mp3')).size > 1000);
});

test('music and wish controls are accessible and use no runtime CDNs', () => {
  for (const file of pageFiles) {
    assert.match(pages[file], /id="music-toggle"[^>]*aria-label=/i);
    assert.doesNotMatch(pages[file], /<(?:script|link)[^>]+(?:src|href)="https?:\/\//i);
  }
  assert.match(pages['wish.html'], /id="wish-button"/i);
  assert.match(pages['wish.html'], /id="wish-status"[^>]*aria-live="polite"/i);
  assert.doesNotMatch(pages['index.html'] + pages['note.html'], /id="wish-button"/i);
});

test('pages support dark mode, reduced motion, and plain visible text', () => {
  assert.match(css, /prefers-color-scheme:\s*dark/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(Object.values(pages).join('\n'), /Xola|[^\x00-\x7F]/i);
  assert.match(css, /--page:\s*#f3f2eb/i);
  assert.match(css, /--accent:\s*#6b7656/i);
  assert.match(js, /song\.play\(\)/);
  assert.match(js, /wishStatus\.textContent/);
});

test('dark colors stay muted and the mobile header keeps music beside the wordmark', () => {
  assert.match(css, /@media \(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{[^}]*--page:\s*#353830/i);
  assert.match(css, /@media \(max-width:\s*760px\)\s*\{[\s\S]*?\.music-toggle\s*\{[^}]*grid-area:\s*music;/i);
});
