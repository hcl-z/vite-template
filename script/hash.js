const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

async function hashDirectory(directory) {
    const files = await getFiles(directory);
    const hash = crypto.createHash('sha256');

    for (const file of files) {
        const fileBuffer = fs.readFileSync(file);
        const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        hash.update(fileHash);
    }
    return hash.digest('hex').substring(0, 8);
}

async function getFiles(directory) {
    const subdirs = await fs.promises.readdir(directory);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(directory, subdir);
        return (await fs.promises.stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

exports.hashDirectory = hashDirectory