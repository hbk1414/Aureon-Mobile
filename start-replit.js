const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Aureon app for Replit...');

// Start Expo web server on port 19006
console.log('Starting Expo web server...');
const expo = spawn('npm', ['run', 'web'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

// Wait a moment for Expo to start, then start the proxy
setTimeout(() => {
  console.log('Starting proxy server...');
  const proxy = spawn('node', ['proxy-server.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd()
  });

  proxy.stdout.on('data', (data) => {
    console.log(`Proxy: ${data}`);
  });

  proxy.stderr.on('data', (data) => {
    console.error(`Proxy Error: ${data}`);
  });

  proxy.on('close', (code) => {
    console.log(`Proxy process exited with code ${code}`);
  });
}, 5000);

expo.stdout.on('data', (data) => {
  console.log(`Expo: ${data}`);
});

expo.stderr.on('data', (data) => {
  console.error(`Expo Error: ${data}`);
});

expo.on('close', (code) => {
  console.log(`Expo process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  expo.kill();
  process.exit();
});