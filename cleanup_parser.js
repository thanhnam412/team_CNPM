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

  // Since we only want to remove these specific neo-brutalist styling classes from buttons/inputs/etc,
  // we could just target ANY string that appears inside a className attribute.
  // Instead of matching the HTML tags, let's just match className="([^"]*)" and className={cn(["'`])([^"'`]*)\1}
  // Actually, let's just do a blanket replace on ALL string literals in the file that contain at least one of these classes.
  // Wait, no. We don't want to strip 'bg-primary' from a regular div that is SUPPOSED to have it.
  // The problem is ONLY with Neo* components.
  // Let's refine the tag matcher. We know JSX tags start with <Neo and end with >. BUT they might have nested > inside {}.
  // We can just find `<Neo` and then scan character by character until we find the closing `>` that is NOT inside `{}`.
  
  let result = "";
  let i = 0;
  let changed = false;
  
  while (i < content.length) {
    if (content.substring(i).startsWith('<Neo')) {
      let j = i;
      let braceDepth = 0;
      let inString = false;
      let stringChar = '';
      
      // Find the end of the tag
      while (j < content.length) {
        let char = content[j];
        if (!inString && (char === '"' || char === "'" || char === '\`')) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar) {
          inString = false;
        } else if (!inString && char === '{') {
          braceDepth++;
        } else if (!inString && char === '}') {
          braceDepth--;
        } else if (!inString && braceDepth === 0 && char === '>') {
          break; // Found the end of the tag
        }
        j++;
      }
      
      let tagContent = content.substring(i, j + 1);
      
      // Inside this tagContent, find all string literals and clean them
      // We will match text inside "", '', or ``
      let newTagContent = tagContent.replace(/(["'`])(.*?)\1/gs, (match, quote, str) => {
         // only clean if it looks like it has classes
         if (str.includes(' ') || classesToRemove.some(c => str.includes(c))) {
             return quote + cleanClassNameString(str) + quote;
         }
         return match;
      });
      
      if (tagContent !== newTagContent) {
        changed = true;
      }
      
      result += newTagContent;
      i = j + 1;
    } else {
      result += content[i];
      i++;
    }
  }

  if (changed) {
    console.log(`Cleaned parser ${filePath}`);
    fs.writeFileSync(filePath, result, 'utf8');
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
console.log("Cleanup parser done");
