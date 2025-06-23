const fs = require('fs');
const path = require('path');
const { platform, BINARIES } = require('./src/check-platform')();

if (!BINARIES[platform]) {
  console.warn(`⚠️ Platform '${platform}' is not supported yet. Skipping binary setup.`);
  process.exit(0); // Gracefully skip
}

const installedBinDir = BINARIES[platform];
if (!fs.existsSync(installedBinDir)) {
  console.warn(`⚠️ Binaries for platform ${platform} not found. Skipping.`);
  process.exit(0); // Also gracefully skip here
}

console.log(`✅ Keeping binaries from: ${installedBinDir}`);
