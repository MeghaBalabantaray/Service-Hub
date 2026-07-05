import { spawn } from 'child_process';

const commands = [
  ['api', 'npm', ['run', 'server']],
  ['web', 'npm', ['run', 'client']],
];

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      return;
    }

    if (code !== 0) {
      console.error(`${name} process exited with code ${code}`);
      process.exitCode = code;
      stopAll();
    }
  });

  return child;
});

function stopAll() {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
}

function gracefulShutdown() {
  stopAll();
  // Give children a moment to exit
  setTimeout(() => process.exit(0), 300);
}

process.on('SIGINT', () => gracefulShutdown());
process.on('SIGTERM', () => gracefulShutdown());

// If a child exits, don't keep other processes around.
process.on('exit', () => stopAll());

// Avoid multiple dev runs fighting for the same ports.
let shuttingDown = false;
for (const child of children) {
  child.on('exit', () => {
    if (shuttingDown) return;
    shuttingDown = true;
    gracefulShutdown();
  });
}

