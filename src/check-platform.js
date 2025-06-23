const path = require('path');
const os = require('os');

const platform = os.platform(); // 'win32', 'darwin', 'linux'
const arch = os.arch(); // 'x64', 'arm64', etc.
const libPath = path.resolve(__dirname, '..', 'lib');
const unpack = (p) => p.replace('app.asar', 'app.asar.unpacked');
console.log("platform",platform)
console.log("arch",arch)
function getBinaryPath() {
  if (platform === 'win32') {
    return unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win32-dynamic', 'bin'));
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
  if (platform === 'win64') {
    return unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win64-dynamic', 'bin'));
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
    win32: unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win32-dynamic', 'bin')),
    win64: unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-win64-dynamic', 'bin')),
    linux: unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-linux-x86_64-static', 'bin')),
    'macosx-x86_64': unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-macosx-x86_64', 'bin')),
    'macosx-arm64': unpack(path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.9-macosx-arm64', 'bin')),
  },
});
