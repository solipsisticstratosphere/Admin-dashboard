const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
  console.log('Created dist directory');
}

console.log('Compiling TypeScript...');
exec('npx tsc -p tsconfig.json', (err, stdout, stderr) => {
  if (err) {
    console.error('Error compiling TypeScript:', err);
    return;
  }

  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);

  console.log('TypeScript compilation complete.');

  if (fs.existsSync('prisma')) {
    if (!fs.existsSync('dist/prisma')) {
      fs.mkdirSync('dist/prisma', { recursive: true });
    }

    try {
      fs.copyFileSync(
        path.join('prisma', 'schema.prisma'),
        path.join('dist', 'prisma', 'schema.prisma'),
      );
      console.log('Copied Prisma schema files');
    } catch (err) {
      console.error('Error copying Prisma files:', err);
    }
  }

  console.log('Build process completed successfully.');
});
