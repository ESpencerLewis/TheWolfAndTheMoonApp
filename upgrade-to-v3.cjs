const fs = require('fs');
const path = require('path');

const root = process.cwd();

function write(file, content) {
  const full = path.join(root, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function replaceInFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      replaceInFiles(full);
    } else {
      if (/\.(js|jsx|ts|tsx|json|html|css)$/.test(file)) {
        let txt = fs.readFileSync(full, 'utf8');
        txt = txt.replace(/@?base44[^\s'"]*/gi, '');
        txt = txt.replace(/Base44/gi, '');
        fs.writeFileSync(full, txt);
      }
    }
  });
}

console.log("Removing Base44...");
replaceInFiles(root);

console.log("Creating CMS...");
write('content/episodes.json', JSON.stringify([
  {
    id: 1,
    title: "Reality Games Premiere",
    description: "Launch episode",
    audioUrl: "/media/audio/episode1.mp3",
    imageUrl: "/media/images/ep1.jpg",
    publishedAt: "2026-04-26",
    duration: "28:14",
    spotifyUrl: "https://open.spotify.com/"
  }
], null, 2));

console.log("Creating API...");
write('src/api/contentClient.js', `
export async function getEpisodes() {
  const res = await fetch('/content/episodes.json');
  return await res.json();
}
`);

console.log("Adding Capacitor config...");
write('capacitor.config.ts', `
export default {
  appId: 'com.wolfandmoon.app',
  appName: 'Wolf And Moon',
  webDir: 'dist'
};
`);

console.log("Updating package.json...");
const pkgPath = path.join(root, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.build = "vite build";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

console.log("Adding App Store checklist...");
write('APP_STORE_CHECKLIST.md', `
- App Icon (1024x1024)
- Privacy Policy URL
- Screenshots (iOS + Android)
- TestFlight build
- Play Store listing
`);

console.log("DONE: Your app is now v3-ready.");