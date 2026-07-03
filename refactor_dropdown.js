const fs = require('fs');
const path = require('path');

const componentsToReplace = [
  { old: 'DropdownMenu', new: 'NeoDropdownMenu' },
  { old: 'DropdownMenuTrigger', new: 'NeoDropdownMenuTrigger' },
  { old: 'DropdownMenuContent', new: 'NeoDropdownMenuContent' },
  { old: 'DropdownMenuItem', new: 'NeoDropdownMenuItem' },
  { old: 'DropdownMenuCheckboxItem', new: 'NeoDropdownMenuCheckboxItem' },
  { old: 'DropdownMenuRadioItem', new: 'NeoDropdownMenuRadioItem' },
  { old: 'DropdownMenuLabel', new: 'NeoDropdownMenuLabel' },
  { old: 'DropdownMenuSeparator', new: 'NeoDropdownMenuSeparator' },
  { old: 'DropdownMenuShortcut', new: 'NeoDropdownMenuShortcut' },
  { old: 'DropdownMenuGroup', new: 'NeoDropdownMenuGroup' },
  { old: 'DropdownMenuPortal', new: 'NeoDropdownMenuPortal' },
  { old: 'DropdownMenuSub', new: 'NeoDropdownMenuSub' },
  { old: 'DropdownMenuSubContent', new: 'NeoDropdownMenuSubContent' },
  { old: 'DropdownMenuSubTrigger', new: 'NeoDropdownMenuSubTrigger' },
  { old: 'DropdownMenuRadioGroup', new: 'NeoDropdownMenuRadioGroup' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace imports
  // Look for import { ... } from "@/components/ui/dropdown-menu"
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@\/components\/ui\/dropdown-menu['"]/g;
  
  if (importRegex.test(content)) {
    // We found it, replace all usages
    content = content.replace(importRegex, (match, imports) => {
      let newImports = imports;
      componentsToReplace.forEach(c => {
        // Only replace whole words
        const regex = new RegExp(`\\b${c.old}\\b`, 'g');
        newImports = newImports.replace(regex, c.new);
      });
      return `import {${newImports}} from "@/components/ui-custom/neo-dropdown-menu"`;
    });

    // Replace JSX tags
    componentsToReplace.forEach(c => {
      // <DropdownMenu
      content = content.replace(new RegExp(`<${c.old}(\\s|>)`, 'g'), `<${c.new}$1`);
      // </DropdownMenu>
      content = content.replace(new RegExp(`</${c.old}>`, 'g'), `</${c.new}>`);
    });

    console.log(`Refactored ${filePath}`);
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

const files = getFiles('./tasker-ui');
files.forEach(processFile);
console.log("Dropdown refactoring done");
