const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

console.log('Starting Aureon app with web proxy on port 5000...');

// Create proxy for web traffic
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:19006',
  changeOrigin: true,
  ws: true
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err.message);
  if (res && !res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error occurred');
  }
});

// Create server on port 5000 for Replit webview
const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Start Expo with both web and mobile support
const expo = spawn('npx', ['expo', 'start', '--web'], {
  stdio: ['pipe', 'inherit', 'inherit'],
  env: { ...process.env }
});

expo.on('error', (error) => {
  console.error('Failed to start Expo:', error);
});

expo.on('close', (code) => {
  console.log(`Expo process exited with code ${code}`);
  process.exit(code);
});

// Start proxy server after a delay
setTimeout(() => {
  server.listen(5000, '0.0.0.0', () => {
    console.log('Proxy server running on http://0.0.0.0:5000');
    console.log('Web app accessible via Replit webview');
  });
}, 8000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close();
  expo.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close();
  expo.kill();
  process.exit();
});