const fs = require('fs')
const path = require('path')
const { hashDirectory } = require('./hash.js')
const dir = fs.readdirSync(path.resolve(__dirname, '../template'))
const repository = 'https://github.com/hcl-z/quick-template'

Promise.all(dir.map(async (item) => {
    const itemPath = path.resolve(__dirname, '../template', item)
    const pkgPath = path.resolve(itemPath, 'package.json')
    if (fs.statSync(itemPath).isDirectory() && fs.existsSync(pkgPath)) {
        const pkg = require(pkgPath)
        return {
            icon: path.join(repository, pkg.icon || ''),
            name: pkg.name,
            desc: pkg.description || '',
            path: path.join(repository, './template', item),
            hash: await hashDirectory(itemPath)
        }
    }
})).then(res => {
    const templateInfoPath = path.resolve(__dirname, '../templateInfo.json')
    const templateInfoStr = require(templateInfoPath)
    templateInfoStr.template = res.filter(item => item)
    fs.writeFileSync(templateInfoPath, JSON.stringify(templateInfoStr))
})

