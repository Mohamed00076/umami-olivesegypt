// Builds the tracker (public/script.js) and recorder (public/recorder.js)
// before the site's own build command runs. Both files are gitignored and
// only produced by `pnpm build`; the build command set in Netlify's UI skips
// them, so every deploy served the app but answered 404 for /script.js and
// no visit was ever recorded. Running here keeps that command as it is.
import fs from 'node:fs';

const FILES = ['public/script.js', 'public/recorder.js'];

export async function onPreBuild({ utils }) {
  await utils.run.command('npx --no-install rollup -c rollup.tracker.config.js');
  await utils.run.command('npx --no-install rollup -c rollup.recorder.config.js');
}

export async function onPostBuild({ utils }) {
  const missing = FILES.filter(f => !fs.existsSync(f));
  if (missing.length) utils.build.failBuild(`Missing after build: ${missing.join(', ')}`);
}
