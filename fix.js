const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(file, 'utf8');
      if ((content.includes('useState') || content.includes('useEffect') || content.includes('useRef')) && !content.includes('use client')) {
        fs.writeFileSync(file, '"use client";\n' + content);
        console.log('Fixed:', file);
      }
    }
  });
  return results;
}

walk('./');
