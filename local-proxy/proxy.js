const Proxy = require('http-mitm-proxy');
const os    = require('os');
const path  = require('path');
const fs    = require('fs');

const PORT = 8080;

// Only strip headers for these trading sites
const TARGET_DOMAINS = [
  'kite.zerodha.com',
  'sensibull.com',
  'niftytrader.in',
];

function isTarget(hostname) {
  return TARGET_DOMAINS.some(d => (hostname || '').includes(d));
}

// ── Certificate directory ────────────────────────────────────────────────────
const CERT_DIR = path.join(__dirname, '.certs');
if (!fs.existsSync(CERT_DIR)) fs.mkdirSync(CERT_DIR, { recursive: true });

// ── Proxy setup ──────────────────────────────────────────────────────────────
const proxy = Proxy();

proxy.onError(function (ctx, err) {
  // Suppress noisy TLS errors from non-target sites
});

proxy.onResponse(function (ctx, callback) {
  const host = ctx.clientToProxyRequest.headers.host || '';

  if (isTarget(host)) {
    const h = ctx.serverToProxyResponse.headers;

    // Remove iframe-blocking headers
    delete h['x-frame-options'];
    delete h['X-Frame-Options'];
    delete h['content-security-policy'];
    delete h['Content-Security-Policy'];
    delete h['content-security-policy-report-only'];

    // Relax SameSite so session cookies reach the iframe
    if (h['set-cookie']) {
      const cookies = Array.isArray(h['set-cookie'])
        ? h['set-cookie']
        : [h['set-cookie']];

      h['set-cookie'] = cookies.map(c =>
        c
          .replace(/;\s*SameSite=\w+/gi, '')
          .replace(/;\s*Secure/gi, '')
          + '; SameSite=None; Secure'
      );
    }
  }

  return callback();
});

// ── Start ────────────────────────────────────────────────────────────────────
proxy.listen({ port: PORT, sslCaDir: CERT_DIR }, function (err) {
  if (err) { console.error('Failed to start proxy:', err.message); process.exit(1); }

  const caPath = path.join(CERT_DIR, 'certs', 'ca.pem');

  // Collect non-loopback IPv4 addresses
  const ips = [];
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) ips.push(iface.address);
    }
  }

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   Multi-Frame Trading — Local Proxy          ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  console.log(`✅  Proxy running on port ${PORT}\n`);
  console.log('──── Step 1 · Find your laptop IP ─────────────');
  if (ips.length) {
    ips.forEach(ip => console.log(`    ${ip}`));
  } else {
    console.log('    Run: ipconfig (Windows) or ifconfig (Mac/Linux)');
  }

  console.log('\n──── Step 2 · Configure phone WiFi proxy ───────');
  console.log('    iPhone: Settings → Wi-Fi → (i) → HTTP Proxy → Manual');
  console.log('    Android: Settings → Wi-Fi → Long-press network → Modify → Advanced');
  console.log(`    Server: <your laptop IP>   Port: ${PORT}\n`);

  console.log('──── Step 3 · Install CA certificate (once) ────');
  console.log(`    Certificate: ${caPath}`);
  console.log('    (Created automatically — send it to your phone)\n');
  console.log('    iPhone:');
  console.log('      AirDrop / email the .pem file to your phone');
  console.log('      Tap it → Settings installs it as a profile');
  console.log('      Settings → General → About → Certificate Trust Settings');
  console.log('      Enable trust for "http-mitm-proxy"\n');
  console.log('    Android:');
  console.log('      Settings → Security → Install certificate → CA certificate\n');

  console.log('──── Step 4 · Open the dashboard ───────────────');
  console.log('    https://subbajandyala.github.io/multiFrameTrading/');
  console.log('    All 3 panels will load live inside the page.\n');

  console.log('Press Ctrl+C to stop the proxy.\n');
});

process.on('SIGINT', () => {
  console.log('\nProxy stopped.');
  process.exit(0);
});
