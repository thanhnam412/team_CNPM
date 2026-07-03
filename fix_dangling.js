const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Find dangling prefixes like "active:" or "hover:" or "disabled:hover:"
  // e.g. `active:"` -> `"`
  // e.g. `active: "` -> ` "`
  // e.g. `active: disabled:opacity-50` -> `disabled:opacity-50`
  
  // This regex looks for these prefixes when they are NOT followed by a valid tailwind class character.
  // E.g. `active: ` or `active:"`
  const danglingRegex = /\b(active:|hover:|disabled:hover:|focus:|disabled:)(?=\s|"|'|`)/g;
  
  content = content.replace(danglingRegex, '');
  
  // Also clean up any double spaces or trailing spaces before quotes
  content = content.replace(/\s+"/g, '"');
  content = content.replace(/\s+"/g, '"');

  // Specific fix for the messy submit button
  content = content.replace(/border-4 h-14 px-10 text-lg\s+disabled:opacity-50\s+disabled:hover:translate-x-0 disabled:hover:translate-y-0\s*/g, 'h-14 px-10 text-lg disabled:opacity-50 disabled:cursor-not-allowed');

  if (content !== originalContent) {
    console.log(`Fixed dangling classes in ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules')) {
        getFiles(filePath, files);
      }
    } else if (filePath.endsWith('.tsx') && !filePath.includes('node_modules')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getFiles('./tasker-ui');
files.forEach(processFile);
console.log("Dangling class fix done");
