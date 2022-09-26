const fs = require('fs');
const pathBuilder = require('path');

let expressDynamicLoader = (area, path) => {
    let absolutePath = path[0] === '/' ? path : pathBuilder.join(__dirname, path);

    fs.readdirSync(absolutePath).forEach(file => {
        let filePath = pathBuilder.join(absolutePath, file);
        let stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            expressDynamicLoader(area.app, filePath);
        } else {
            if (file.endsWith('.js')) {
                let fileContent = require(filePath);

                if (typeof fileContent === 'function') {
                    fileContent(area.app);
                }
            }
        }
    })
}

module.exports = {expressDynamicLoader}
