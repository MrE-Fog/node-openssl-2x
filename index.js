'use strict';
const fs = require('fs');
const { exec } = require('child_process');

function openssl(args) {
  return new Promise(function execPrimiseHandler(resolve, reject) {
    var verb, flags, tail;

    switch (args.length) {
      case 1:
        args = args[0].split(' ').filter((elem) => elem.length);
        verb = args.shift();
        flags = args.join(' ');
        break;
      case 3:
        verb = args[0];
        flags = args[1];
        if (!Array.isArray(flags) && typeof flags === 'string') {
          flags = flags.split('-').filter((elem) => elem.length);
          flags.forEach((elem, index) => {
            flags[index] = `-${elem}`;
          });
        }
        if (!Array.isArray(flags)) {
          reject(
            new Error(
              `Second argument must be an array or string of command flags.`,
            ),
          );
        }
        flags = flags.join(' ');
        tail = args[2];
        if (typeof tail !== 'string' || typeof tail !== 'number') {
          reject(
            new Error(`Third argument must be a string or number argument.`),
          );
        }
        if (typeof tail === 'number') {
          tail = tail.toString();
        }
        break;
      default:
        reject(
          new Error(
            `Command and arguments are required. Either as one argument string or three (3) arguments.`,
          ),
        );
    }

    var stdout = '';
    var stderr = '';
    const cp = exec(`openssl ${verb} ${flags}`);
    cp.stdout.on('data', (data) => {
      stdout += data;
    });

    cp.stderr.on('data', (data) => {
      stderr += data;
    });

    cp.on('close', (code) => {
      resolve({ stdout, stderr });
    });
    cp.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = openssl;
