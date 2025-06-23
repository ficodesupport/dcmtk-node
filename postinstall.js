const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { platform, BINARIES } = require('./src/check-platform')();

if (!BINARIES[platform]) {
  console.warn(`⚠️ Platform '${platform}' is not supported yet. Skipping binary setup.`);
  process.exit(0);
}

const installedBinDir = BINARIES[platform];

if (!fs.existsSync(installedBinDir)) {
  console.warn(`⚠️ Binaries for platform ${platform} not found at ${installedBinDir}. Skipping.`);
  process.exit(0);
}

console.log(`✅ Binaries found: ${installedBinDir}`);

try {
  if (platform.startsWith('linux') || platform.startsWith('darwin')) {
    const files = fs.readdirSync(installedBinDir);
    files.forEach(file => {
      const fullPath = path.join(installedBinDir, file);
      if (fs.statSync(fullPath).isFile()) {
        execSync(`chmod +x "${fullPath}"`);
        console.log(`🔓 Set executable: ${fullPath}`);
      }
    });
  }
} catch (err) {
  console.error(`❌ Failed to set permissions: ${err.message}`);
  process.exit(1); // Fail only if permission fix fails
}
