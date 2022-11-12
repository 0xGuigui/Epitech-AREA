class ServiceComponent {
    constructor(componentName, description) {
        this.name = componentName;
        this.description = description;
        this.validationSchema = null;
    }

    on(event, func) {
        if (func instanceof Function) {
            this[event] = func;
            return this;
        } else {
            throw new Error("The function must be a function");
        }
    }
}

class Action extends ServiceComponent {
    constructor(actionName, description = actionName, webhook = false) {
        super(actionName, description);
        this.webhook = webhook;
    }
}

class Reaction extends ServiceComponent {
    constructor(reactionName, description = reactionName) {
        super(reactionName, description);
    }
}

class Service {
    active = true
    locked = false

    constructor(serviceName, serviceDescription = serviceName, colorPalette = {mainColor: '#FFFFFF', secondaryColor: '#000000'}) {
        this.name = serviceName;
        this.description = serviceDescription;
        this.actions = [];
        this.reactions = [];
        this.colorPalette = colorPalette
        this.authenticate = (code) => null
        this.checkToken = (token) => null
    }

    addAction(...actions) {
        actions.forEach(action => {
            if (action instanceof Action) {
                this.actions.push(action);
                return this;
            } else {
                throw new Error("The action must be an instance of Action");
            }
        })
    }

    addReaction(...reactions) {
        reactions.forEach(reaction => {
            if (reaction instanceof Reaction) {
                this.reactions.push(reaction);
                return this;
            } else {
                throw new Error("The reaction must be an instance of Reaction");
            }
        })
    }

    getAction(actionName) {
        return this.actions.find(action => action.name === actionName);
    }

    getReaction(reactionName) {
        return this.reactions.find(reaction => reaction.name === reactionName);
    }

    setAuthentification(authFunction) {
        if (authFunction instanceof Function) {
            this.authenticate = authFunction
        }
    }

    setCheckToken(checkFunction) {
        if (checkFunction instanceof Function) {
            this.checkToken = checkFunction
        }
    }

    lockState() {
        this.locked = true;
    }

    updateState(newState) {
        if (this.locked) return false;

        this.active = newState;
        return true;
    }
}

module.exports = {
    Service,
    Action,
    Reaction
}
