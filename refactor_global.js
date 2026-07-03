const fs = require('fs');
const path = require('path');

const componentsToReplace = [
  { old: 'Button', new: 'NeoButton', file: 'button', newFile: 'neo-button' },
  { old: 'Card', new: 'NeoCard', file: 'card', newFile: 'neo-card' },
  { old: 'CardHeader', new: 'NeoCardHeader', file: 'card', newFile: 'neo-card' },
  { old: 'CardTitle', new: 'NeoCardTitle', file: 'card', newFile: 'neo-card' },
  { old: 'CardDescription', new: 'NeoCardDescription', file: 'card', newFile: 'neo-card' },
  { old: 'CardContent', new: 'NeoCardContent', file: 'card', newFile: 'neo-card' },
  { old: 'CardFooter', new: 'NeoCardFooter', file: 'card', newFile: 'neo-card' },
  { old: 'Badge', new: 'NeoBadge', file: 'badge', newFile: 'neo-badge' },
  { old: 'Input', new: 'NeoInput', file: 'input', newFile: 'neo-input' },
  { old: 'Textarea', new: 'NeoTextarea', file: 'textarea', newFile: 'neo-textarea' },
  { old: 'Checkbox', new: 'NeoCheckbox', file: 'checkbox', newFile: 'neo-checkbox' },
  { old: 'Avatar', new: 'NeoAvatar', file: 'avatar', newFile: 'neo-avatar' },
  { old: 'AvatarImage', new: 'NeoAvatarImage', file: 'avatar', newFile: 'neo-avatar' },
  { old: 'AvatarFallback', new: 'NeoAvatarFallback', file: 'avatar', newFile: 'neo-avatar' },
  { old: 'Select', new: 'NeoSelect', file: 'select', newFile: 'neo-select' },
  { old: 'SelectTrigger', new: 'NeoSelectTrigger', file: 'select', newFile: 'neo-select' },
  { old: 'SelectContent', new: 'NeoSelectContent', file: 'select', newFile: 'neo-select' },
  { old: 'SelectItem', new: 'NeoSelectItem', file: 'select', newFile: 'neo-select' },
  { old: 'SelectValue', new: 'NeoSelectValue', file: 'select', newFile: 'neo-select' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace imports
  componentsToReplace.forEach(c => {
    // Look for import { ... Old ... } from "@/components/ui/old_file"
    const importRegex = new RegExp(`import\\s+{([^}]*)\\b${c.old}\\b([^}]*)}\\s+from\\s+['"]@\\/components\\/ui\\/${c.file}['"]`, 'g');
    
    if (importRegex.test(content)) {
      content = content.replace(importRegex, (match, before, after) => {
        // We replace it by changing the old name to the new name and changing the path
        // Note: if there are other imports in the same line, this might split them. It's safer to just rewrite the whole line or add a new line.
        // But since we usually import them together (like Card, CardHeader), we can just replace all occurrences of `c.old` with `c.new` in the import block, and change the path.
        let newImports = (before + c.old + after).replace(new RegExp(`\\b${c.old}\\b`, 'g'), c.new);
        // also replace any related sub-components if they are in the same line (e.g. CardTitle)
        componentsToReplace.forEach(sub => {
          if (sub.file === c.file) {
            newImports = newImports.replace(new RegExp(`\\b${sub.old}\\b`, 'g'), sub.new);
          }
        });
        return `import {${newImports}} from "@/components/ui-custom/${c.newFile}"`;
      });
    }

    // Replace JSX tags
    // <Button -> <NeoButton
    content = content.replace(new RegExp(`<${c.old}(\\s|>)`, 'g'), `<${c.new}$1`);
    // </Button> -> </NeoButton>
    content = content.replace(new RegExp(`</${c.old}>`, 'g'), `</${c.new}>`);
  });

  if (content !== originalContent) {
    console.log(`Refactored ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('ui-custom') && !filePath.includes('components/ui')) {
        getFiles(filePath, files);
      }
    } else if (filePath.endsWith('.tsx') && !filePath.includes('node_modules')) {
      files.push(filePath);
    }
  }
  return files;
}

let allFiles = [];
allFiles = getFiles('./tasker-ui/app', allFiles);
allFiles = getFiles('./tasker-ui/components', allFiles);
allFiles = getFiles('./tasker-ui/block-ui', allFiles);

allFiles.forEach(processFile);
console.log("Global refactoring done");
