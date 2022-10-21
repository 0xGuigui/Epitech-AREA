const fs = require('fs');
const pathBuilder = require('path');

let dynamicLoader = (area, path, excluded = []) => {
    let absolutePath = path[0] === '/' ? path : pathBuilder.join(__dirname, path);

    fs.readdirSync(absolutePath).forEach(file => {
        if (excluded.includes(file)) {
            return;
        }

        let filePath = pathBuilder.join(absolutePath, file);
        let stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            dynamicLoader(area, filePath);
        } else {
            if (file.endsWith('.js')) {
                let fileContent = require(filePath);

                if (typeof fileContent === 'function') {
                    fileContent(area);
                }
            }
        }
    })
}

module.exports = {dynamicLoader}
