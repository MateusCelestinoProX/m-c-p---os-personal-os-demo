const fs = require('fs');
const path = require('path');

console.log('--- MCP Personal OS: Starting Vercel Production Build ---');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

const itemsToCopy = [
    'index.html',
    'calendar.html',
    'admin.html',
    'diary.html',
    'chat.html',
    'pomodoro.html',
    'pomodoro.css',
    'oauth.html',
    'manifest.json',
    'sw.js',
    'js',
    'assets',
    'components',
    'data'
];

function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        for (const child of fs.readdirSync(src)) {
            copyRecursive(path.join(src, child), path.join(dest, child));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

for (const item of itemsToCopy) {
    const srcPath = path.join(__dirname, item);
    const destPath = path.join(publicDir, item);
    if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, destPath);
        console.log(`✓ Copied ${item} to public/`);
    }
}

console.log('--- Vercel Production Build Finished Successfully! Output Directory: public/ ---');
