const fs = require('fs');
const path = require('path');

const map = {
  'base': '1',
  'xs': '2',
  'sm': '3',
  'md': '4',
  'gutter': '4',
  'container-padding': '5',
  'lg': '6',
  'xl': '8'
};

const prefixes = [
  'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr',
  'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
  'gap', 'gap-x', 'gap-y',
  'top', 'bottom', 'left', 'right', 'inset', 'inset-x', 'inset-y',
  'space-x', 'space-y',
  'w', 'h', 'size'
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex = new RegExp(`\\b(${prefixes.join('|')})-(base|xs|sm|md|gutter|container-padding|lg|xl)\\b`, 'g');
      
      content = content.replace(regex, (match, p1, p2) => {
        return `${p1}-${map[p2]}`;
      });
      
      fs.writeFileSync(fullPath, content);
      console.log(`Processed ${fullPath}`);
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Migration complete!');
