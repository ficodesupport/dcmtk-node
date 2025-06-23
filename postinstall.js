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
  const files = fs.readdirSync(installedBinDir);
  files.forEach(file => {
    const fullPath = path.join(installedBinDir, file);
    if (!fs.statSync(fullPath).isFile()) return;

    if (platform.startsWith('linux') || platform.startsWith('darwin')) {
      execSync(`chmod +x "${fullPath}"`);
      console.log(`🔓 Set executable: ${fullPath}`);
    } else if (platform === 'win32') {
      // Optional: Unblock files if Defender blocked them (PowerShell trick)
      try {
        execSync(`powershell -Command "Unblock-File -Path '${fullPath}'"`, { stdio: 'ignore' });
        console.log(`✅ Windows file accessible: ${file}`);
      } catch (psErr) {
        console.warn(`⚠️ Could not unblock ${file} via PowerShell (may still be usable): ${psErr.message}`);
      }
    }
  });
} catch (err) {
  console.error(`❌ Failed to process binaries: ${err.message}`);
  process.exit(1);
}
