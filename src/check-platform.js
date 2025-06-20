const path = require('path');
const os = require('os');

const platform = os.platform();
const arch = os.arch(); // e.g., 'x64', 'arm64'

const libPath = path.resolve(__dirname, '..', 'lib');
const unpack = (dir) => dir.replace('app.asar', 'app.asar.unpacked');

// Resolve the correct binary path based on OS and architecture
function getBinaryPath() {
  if (platform === 'win32') {
    if (arch === 'ia32') {
      // 32-bit Windows
      return unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win32-dynamic', 'bin'));
    } else {
      // 64-bit Windows
      return unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win64-dynamic', 'bin'));
    }
  }

  if (platform === 'darwin') {
    if (arch === 'arm64') {
      return unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-macosx-arm64', 'bin'));
    } else {
      return unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-macosx-x86_64', 'bin'));
    }
  }

  if (platform === 'linux') {
    return unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-linux-x86_64-static', 'bin'));
  }

  throw new Error(`Unsupported platform or architecture: ${platform} ${arch}`);
}

const binaryPath = getBinaryPath();

const BINARIES = {
  win32: unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win32-dynamic', 'bin')),
  win64: unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win64-dynamic', 'bin')),
  linux: unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-linux-x86_64-static', 'bin')),
  'macosx-x86_64': unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-macosx-x86_64', 'bin')),
  'macosx-arm64': unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-macosx-arm64', 'bin')),
};

const DCMDICTPATH = path.resolve(binaryPath, '..', 'share', 'dcmtk', 'dicom.dic');

module.exports = () => ({
  platform,
  arch,
  DCMDICTPATH,
  BINARIES,
  binaryPath,
});
