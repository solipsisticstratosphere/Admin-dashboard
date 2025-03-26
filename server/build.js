const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting enhanced build process...');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
  console.log('Created dist directory');
}

// Define a function to execute commands with proper error handling
function runCommand(command) {
  console.log(`Executing: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// First run NestJS build
if (!runCommand('npx nest build')) {
  console.error('NestJS build failed');
  process.exit(1);
}

// Ensure main.js exists
if (!fs.existsSync('dist/src/main.js')) {
  console.log('dist/src/main.js not found after nest build, compiling TypeScript manually');

  // Try manual TypeScript compilation
  if (!runCommand('npx tsc -p tsconfig.json')) {
    console.error('Manual TypeScript compilation failed');

    // Last resort - create dist/src directory and copy TS files
    console.log('Attempting to copy and transpile TS files manually');

    if (!fs.existsSync('dist/src')) {
      fs.mkdirSync('dist/src', { recursive: true });
    }

    // Copy main.ts and transpile it
    fs.copyFileSync('src/main.ts', 'dist/src/main.ts');
    runCommand('npx tsc dist/src/main.ts --outDir dist/src');

    if (!fs.existsSync('dist/src/main.js')) {
      console.error('CRITICAL ERROR: Could not create dist/src/main.js');
      process.exit(1);
    }
  }
}

// Copy Prisma schema and migrations
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

    // Copy migrations folder if it exists
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

// Copy .env file if it exists and dist/.env doesn't
if (fs.existsSync('.env') && !fs.existsSync('dist/.env')) {
  try {
    fs.copyFileSync('.env', 'dist/.env');
    console.log('Copied .env file to dist');
  } catch (err) {
    console.error('Error copying .env file:', err);
  }
}

// Final verification
if (fs.existsSync('dist/src/main.js')) {
  console.log('Build completed successfully. dist/src/main.js exists.');
} else {
  console.error('ERROR: dist/src/main.js not found! Build failed.');
  process.exit(1);
}

console.log('Enhanced build process completed.');
