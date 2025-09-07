const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server with custom application logic
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:19006',
  changeOrigin: true,
  ws: true, // enable websocket proxying
});

// Handle proxy errors
proxy.on('error', function (err, req, res) {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Proxy error occurred');
});

// Create server that listens on port 5000 and proxies to Expo on 19006
const server = http.createServer(function (req, res) {
  // Add CORS headers to allow all origins
  proxy.web(req, res, {
    target: 'http://localhost:19006'
  });
});

// Handle websocket upgrades for hot reloading
server.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', function() {
  console.log(`Proxy server running on http://0.0.0.0:${PORT}`);
  console.log(`Proxying requests to http://localhost:19006`);
});

server.on('error', function(err) {
  console.error('Server error:', err);
});