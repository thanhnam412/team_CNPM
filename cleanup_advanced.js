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
  /active:bg-[a-zA-Z0-9\-\/]+/g,
];

function cleanClassNameString(classNameStr) {
  let classes = classNameStr.split(/\s+/);
  classes = classes.filter(c => !classesToRemove.includes(c));
  
  let result = classes.join(' ');
  regexToRemove.forEach(regex => {
    result = result.replace(regex, '');
  });
  
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // We only want to target Neo* components. 
  // Let's find all Neo tags: <Neo... ...> or <Neo... />
  const neoTagRegex = /<(NeoButton|NeoCard|NeoBadge|NeoInput|NeoTextarea|NeoSelectTrigger|NeoCheckbox|NeoAvatar)([\s\S]*?)>/g;

  content = content.replace(neoTagRegex, (match, tag, inner) => {
    // inside the tag, find className="..." or className={...}
    // Since nested {} is hard with regex, we'll just look for any string literal "..." or '...' or `...` inside `inner` 
    // that looks like it contains tailwind classes, and clean it.
    // Wait, safer is to match className="..." or className={"..."} or className={cn("...")}
    
    // Replace all string literals inside the tag attributes if it has className
    if (!inner.includes('className=')) {
      return match;
    }

    let newInner = inner.replace(/(["'`])([^"'`]*)\1/g, (strMatch, quote, strContent) => {
      // Check if this string looks like a tailwind class list (has spaces and typical tailwind words)
      // Since it's inside a Neo component's attributes, we just clean any string that has our classes.
      const cleaned = cleanClassNameString(strContent);
      return quote + cleaned + quote;
    });

    return `<${tag}${newInner}>`;
  });

  if (content !== originalContent) {
    console.log(`Cleaned advanced ${filePath}`);
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
console.log("Cleanup advanced done");
