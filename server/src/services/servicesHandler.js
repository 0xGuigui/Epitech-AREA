const fs = require('fs');
const path = require('path');

let loadServices = (area) => {
    let servicesPath = __dirname

    fs.readdirSync(servicesPath).forEach((file) => {
        if (fs.lstatSync(path.join(servicesPath, file)).isDirectory()) {
            let fsPath = path.join(servicesPath, file, file + '.js')

            if (fs.existsSync(fsPath)) {
                area.services.push(require(fsPath));
            } else {
                throw new Error('Missing entry point for service: ' + file);
            }
        }
    })
}

module.exports = { loadServices }
