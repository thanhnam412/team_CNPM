const fs = require('fs');
const path = require('path');

const classesToRemove = [
  'rounded-none',
  'border-2',
  'border-foreground',
  'border-border',
  'border-primary',
  'bg-foreground',
  'bg-primary',
  'bg-transparent',
  'bg-secondary',
  'bg-card',
  'text-background',
  'text-primary-foreground',
  'text-foreground',
  'text-primary',
  'uppercase',
  'font-black',
  'font-bold',
  'tracking-widest',
  'transition-all',
  'transition-colors',
  'shadow-sm',
  'rounded-full',
  'font-mono'
];

const regexToRemove = [
  /shadow-\[[^\]]+\]/g,
  /hover:-?translate-[xy]-\[[^\]]+\]/g,
  /active:-?translate-[xy]-\[[^\]]+\]/g,
  /hover:shadow-\[[^\]]+\]/g,
  /active:shadow-\[[^\]]+\]/g,
  /hover:bg-[a-zA-Z0-9\-\/]+/g,
  /group-hover:bg-[a-zA-Z0-9\-\/]+/g,
  /group-hover:text-[a-zA-Z0-9\-\/]+/g,
  /hover:text-[a-zA-Z0-9\-\/]+/g,
  /hover:border-[a-zA-Z0-9\-\/]+/g,
];

function cleanClassName(classNameStr) {
  let classes = classNameStr.split(/\s+/);
  classes = classes.filter(c => !classesToRemove.includes(c));
  
  let result = classes.join(' ');
  regexToRemove.forEach(regex => {
    result = result.replace(regex, '');
  });
  
  // Clean up multiple spaces
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Regex to find NeoButton, NeoCard, NeoBadge, NeoInput, NeoTextarea, NeoSelectTrigger, NeoCheckbox, NeoAvatar
  const tagRegex = /<(NeoButton|NeoCard|NeoBadge|NeoInput|NeoTextarea|NeoSelectTrigger|NeoCheckbox|NeoAvatar)([^>]*?)className="([^"]*)"([^>]*?)>/g;
  
  content = content.replace(tagRegex, (match, tag, before, className, after) => {
    const cleaned = cleanClassName(className);
    if (cleaned === '') {
      return `<${tag}${before}${after}>`;
    }
    return `<${tag}${before}className="${cleaned}"${after}>`;
  });

  if (content !== originalContent) {
    console.log(`Cleaned ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, files);
    } else if (filePath.endsWith('.tsx') && !filePath.includes('node_modules')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getFiles('./tasker-ui/app');
files.forEach(processFile);
console.log("Cleanup done");
