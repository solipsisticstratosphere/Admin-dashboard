const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function getAllFiles(dir, fileList = []) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        fileList = await getAllFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (['.ts', '.js', '.json', '.md', '.yml', '.yaml'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

async function fixLineEndings() {
  try {
    const files = await getAllFiles(path.resolve(__dirname));
    console.log(`Found ${files.length} files to process`);

    let fixedCount = 0;
    for (const file of files) {
      const content = await readFile(file, 'utf8');

      // Replace CRLF with LF
      const fixedContent = content.replace(/\r\n/g, '\n');

      if (content !== fixedContent) {
        await writeFile(file, fixedContent, 'utf8');
        console.log(`Fixed: ${file}`);
        fixedCount++;
      }
    }

    console.log(`\nCompleted! Fixed ${fixedCount} out of ${files.length} files.`);
  } catch (error) {
    console.error('Error fixing line endings:', error);
  }
}

fixLineEndings();
