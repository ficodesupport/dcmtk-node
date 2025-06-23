const path = require('path');
const os = require('os');

const platform = os.platform(); // 'win32', 'darwin', 'linux'
const arch = os.arch();         // 'x64', 'arm64', etc.

const libPath = path.resolve(__dirname, '..', 'lib');

// Handles Electron asar unpacking if needed
const unpack = (p) => p.replace('app.asar', 'app.asar.unpacked');

function getBinaryPath() {
  if (platform === 'win32') {
    return arch === 'x64'
      ? unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win64-dynamic', 'bin'))
      : unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win32-dynamic', 'bin'));
  }

  if (platform === 'darwin') {
    return arch === 'arm64'
      ? unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-macosx-arm64', 'bin'))
      : unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-macosx-x86_64', 'bin'));
  }

  if (platform === 'linux') {
    return unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-linux-x86_64-static', 'bin'));
  }

  throw new Error(`❌ Unsupported platform or architecture: ${platform} ${arch}`);
}

const binaryPath = getBinaryPath();

const DCMDICTPATH = path.resolve(binaryPath, '..', 'share', 'dcmtk', 'dicom.dic');

module.exports = () => ({
  platform,
  arch,
  binaryPath,
  DCMDICTPATH,
  BINARIES: {
    win32: arch === 'x64'
      ? unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win64-dynamic', 'bin'))
      : unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win32-dynamic', 'bin')),
    darwin: arch === 'arm64'
      ? unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-macosx-arm64', 'bin'))
      : unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-macosx-x86_64', 'bin')),
    linux: unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-linux-x86_64-static', 'bin')),
  }
});
