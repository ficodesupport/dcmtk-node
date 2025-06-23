const { platform, BINARIES } = require('./src/check-platform')();

const installedBinDir = BINARIES[platform];

console.log(`✅ Keeping binaries from: ${installedBinDir}`);

// Instead of deleting anything, ensure symlink exists or .env is set
if (!fs.existsSync(installedBinDir)) {
  console.error(`❌ Binaries for platform ${platform} not found.`);
  process.exit(1);
}
