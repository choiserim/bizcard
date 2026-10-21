// 명함 매니저 로컬 웹서버 (설치할 것 없음: node server.js)
// - PC 브라우저:   http://localhost:8080  (실시간 카메라 사용 가능)
// - 같은 Wi-Fi 휴대폰: http://<PC IP>:8080  (기본 카메라 앱으로 촬영)
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = Number(process.env.PORT) || 8080;
const ROOT = __dirname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT) || path.basename(file) === 'server.js') { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log(`명함 매니저 실행 중`);
  console.log(`  PC:     http://localhost:${PORT}`);
  Object.values(os.networkInterfaces()).flat()
    .filter((n) => n && n.family === 'IPv4' && !n.internal)
    .forEach((n) => console.log(`  휴대폰: http://${n.address}:${PORT}  (같은 Wi-Fi)`));
});
