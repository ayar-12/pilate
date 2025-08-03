const fs = require('fs');
const path = require('path');

function scanRoutes(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanRoutes(fullPath);
    } else if (file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const regex = /router\.(get|post|put|delete|use)\(['"`]\/:(?![a-zA-Z0-9_])/g;
      const matches = content.match(regex);
      if (matches) {
        console.warn(`🚨 INVALID ROUTE in ${fullPath}:`, matches);
      }
    }
  }
}

console.log('🔎 Scanning for invalid route parameters...');
scanRoutes(path.join(__dirname, 'Backend', 'routes'));
