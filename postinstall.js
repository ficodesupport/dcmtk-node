const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { platform, BINARIES } = require('./src/check-platform')();

const binariesToKeep = [
  'dcmdump',
  'echoscu',
  'findscu',
  'storescp',
  'dcmqrscp',
  'movescu',
  'dcmqridx',
  'dcmconv',
  'storescu',
  'dcmodify',
  'getscu',
  'dcmxml'
];

const installedAsModule = path.basename(path.resolve(__dirname, '..')) === 'node_modules';

Object.keys(BINARIES).forEach((os) => {
  if (os.slice(0, 3) === platform.slice(0, 3)) {
    const files = fs.readdirSync(BINARIES[os]);
    files.forEach((file) => {
      // only delete .exe on windows
      if ((os === 'win32' || os === 'win64') && file.slice(-3) !== 'exe') {
        if (!installedAsModule) {
          console.log('Not .exe, do not delete:', file);
        }
        return;
      }

      const filename = path.basename(file, '.exe');
      if (!binariesToKeep.includes(filename)) {
        const filePath = path.resolve(BINARIES[os], file);
        try {
          fs.accessSync(filePath, fs.constants.F_OK);
          if (installedAsModule) {
            fs.unlinkSync(filePath);
          } else {
            console.log('Delete', filePath);
          }
        } catch {
          // File doesn't exist
        }
      }
    });
  } else {
    const dirPath = path.resolve(BINARIES[os], '..');
    if (installedAsModule) {
      rimraf.sync(dirPath);
    } else {
      console.log('Delete', dirPath);
    }
  }
});
