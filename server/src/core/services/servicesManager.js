const pathBuilder = require("path");
const fs = require("fs");

module.exports = class ServicesManager {
    constructor(area) {
        this.services = [];

        fs.readdirSync(__dirname).forEach(file => {
            let filePath = pathBuilder.join(__dirname, file);
            let stat = fs.statSync(filePath);

            if (stat && stat.isDirectory()) {
                let fileContent = require(pathBuilder.join(filePath, file + '.js'));

                if (typeof fileContent === 'function') {
                    fileContent(area, this);
                }
            }
        })
    }

    addService(service) {
        this.services.push(service);
    }

    getService(serviceName) {
        return this.services.find(service => service.name === serviceName);
    }

    getServiceAction(serviceName, actionName) {
        let service = this.getService(serviceName);

        if (service) {
            return service.actions.find(action => action.name === actionName);
        }
        return null;
    }

    getServiceReaction(serviceName, reactionName) {
        let service = this.getService(serviceName);

        if (service) {
            return service.reactions.find(reaction => reaction.name === reactionName);
        }
        return null;
    }
}
