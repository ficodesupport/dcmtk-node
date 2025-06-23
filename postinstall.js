const fs = require('fs'); // ✅ ADD THIS
const path = require('path');
const { platform, BINARIES } = require('./src/check-platform')();

const installedBinDir = BINARIES[platform];
if (!fs.existsSync(installedBinDir)) {
  console.error(`❌ Binaries for platform ${platform} not found.`);
  process.exit(1);
}
console.log(`✅ Keeping binaries from: ${installedBinDir}`);
