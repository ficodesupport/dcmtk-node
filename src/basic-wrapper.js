const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const outputParsers = require('./output-parsers');
const regexes = require('./output-parsers/regexes');

module.exports = (_options) => {
  const { command, platform, settings } = _options;

  const isWindows = platform.platform === 'win32' || platform.platform === 'win64';
  const binaryString = path.join(platform.binaryPath, isWindows ? `${command}.exe` : command);

  return function basicWrapper(_options2, _callback) {
    let callback = _callback;
    let options = _options2;
    const env = settings.env || {};

    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (!callback) {
      throw new Error('Callback function required');
    }

    let { args } = options;
    if (!args) args = [];
    if (!Array.isArray(args)) {
      return callback('Parameter "args" must be array of strings');
    }

    // Check for conflicts with --log-level
    const lowerArgs = args.map(arg => arg.toLowerCase());
    const hasConflictingFlags =
      lowerArgs.includes('-v') || lowerArgs.includes('--verbose') ||
      lowerArgs.includes('--debug') || lowerArgs.includes('--quiet');

    if (settings.loglevel && !hasConflictingFlags) {
      args.unshift('--log-level', settings.loglevel);
    }

    // Add --print-filename when scanning directories
    if (args.includes('--scan-directories') || args.includes('+sd')) {
      if (!(args.includes('--print-filename') || args.includes('+F'))) {
        args.unshift('--print-filename');
      }
    }

    if (options.verbose || settings.verbose) {
      console.log('Executing:', binaryString, args.join(' '));
    }

    if (!fs.existsSync(binaryString)) {
      return callback(`❌ Executable not found: ${binaryString}`);
    }

    const child = spawn(binaryString, args, { env, shell: false });
    let combined = '';

    child.stdout.on('data', (data) => (combined += data));
    child.stderr.on('data', (data) => (combined += data));
    child.on('error', callback);
    child.on('close', (code) => {
      if (options.verbose || settings.verbose) {
        console.log('Process closed with code:', code);
      }

      if (
        code &&
        code !== 0 &&
        !args.includes('--scan-directories') &&
        !args.includes('+sd') &&
        !args.includes('--ignore-errors') &&
        !args.includes('+E')
      ) {
        let err = '';
        const lines = combined.split(/\r?\n/);
        lines.forEach((l) => {
          if (regexes.errorRegex.test(l)) err += `${l}\n`;
        });
        return callback(err.length ? err : `Unknown error\nSTDOUT/STDERR: ${combined}`);
      }

      return callback(null, {
        parsed:
          outputParsers[command] && combined
            ? outputParsers[command](combined, args)
            : combined,
        output: combined,
      });
    });

    return true;
  };
};
