// fix-paths.js
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing file paths for Electron...');

// Fix main index.html
const indexPath = path.join(__dirname, 'out', 'index.html');
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  content = content.replace(/"\/_next\//g, '"./_next/');
  content = content.replace(/"\/webpack/g, '"./webpack');
  fs.writeFileSync(indexPath, content);
  console.log('✅ Fixed index.html paths');
}

// Fix Flashcards index.html
const flashcardsPath = path.join(__dirname, 'out', 'Flashcards', 'index.html');
if (fs.existsSync(flashcardsPath)) {
  let content = fs.readFileSync(flashcardsPath, 'utf8');
  content = content.replace(/"\/_next\//g, '"../_next/');
  content = content.replace(/"\/webpack/g, '"../webpack');
  fs.writeFileSync(flashcardsPath, content);
  console.log('✅ Fixed Flashcards/index.html paths');
}

// Fix all JS files to use relative paths
const nextStaticPath = path.join(__dirname, 'out', '_next', 'static');
if (fs.existsSync(nextStaticPath)) {
  // This would require more complex parsing, but for now we'll focus on HTML
  console.log('✅ _next/static directory exists');
}

console.log('🎉 Path fixing complete!');