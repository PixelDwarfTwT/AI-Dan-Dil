# Aidil Birthday Website Design

## Intent
Turn the cloned birthday animation into a personal birthday website for Aidil that a friend can share. Keep the existing birthday song and make the recipient's name correct.

## Audit and direction
The original page uses a long jQuery button sequence, a dark loading screen, remote Bootstrap/jQuery/Google Font/LESS dependencies, and copy addressed to Xola. Keep the birthday-song asset and replace the sequence with three linked pages: a greeting, a personal note, and a wish interaction. Use a muted sage and warm-neutral palette across every page, a softened cake still life, and plain text controls without decorative glyphs.

## Approaches
- Keep the legacy jQuery sequence and reskin it: preserves the original animation but keeps its brittle dependencies and many-step flow.
- Rebuild as a small static HTML/CSS/JavaScript site: preserves the original song and runs without a build step. **Selected by the implementer** because it suits a lightweight, shareable greeting with a few distinct pages and avoids adding dependencies.
- Move to a component framework: more structure than this small static site needs.

## Scope and constraints
Use the existing project and assets, add a generated cake image, personalize all visible recipient copy to Aidil, support light and dark system themes, provide reduced-motion behavior, and keep every page responsive and keyboard accessible. Keep the same navigation and palette on each page. Avoid sharp color changes and special-character decorations. The music must start only after the visitor chooses it. No external runtime libraries or new npm packages.

## Success checks
All three pages name Aidil, link to each other, and fit desktop and mobile layouts. Music toggles from a user gesture, the wish interaction produces brief celebratory feedback, and every page loads from the local server with no missing assets or console errors.
