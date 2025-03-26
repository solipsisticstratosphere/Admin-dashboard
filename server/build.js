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
      console.log('Copied Prisma schema file');

      if (fs.existsSync(path.join('prisma', 'migrations'))) {
        const migrationsDir = path.join('dist', 'prisma', 'migrations');
        if (!fs.existsSync(migrationsDir)) {
          fs.mkdirSync(migrationsDir, { recursive: true });
        }

        fs.readdirSync(path.join('prisma', 'migrations')).forEach((file) => {
          const sourcePath = path.join('prisma', 'migrations', file);
          const destPath = path.join(migrationsDir, file);

          if (fs.statSync(sourcePath).isDirectory()) {
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath, { recursive: true });
            }

            fs.readdirSync(sourcePath).forEach((subFile) => {
              fs.copyFileSync(path.join(sourcePath, subFile), path.join(destPath, subFile));
            });
          } else {
            fs.copyFileSync(sourcePath, destPath);
          }
        });
        console.log('Copied Prisma migrations');
      }
    } catch (err) {
      console.error('Error copying Prisma files:', err);
    }
  }

  if (fs.existsSync('dist/src/main.js')) {
    console.log('Build completed successfully. dist/src/main.js exists.');
  } else {
    console.error('ERROR: dist/src/main.js not found! Build may be incorrect.');
    process.exit(1);
  }
});
