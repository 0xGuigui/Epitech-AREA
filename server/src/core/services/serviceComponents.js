const expressValidator = require('express-validator')

let notImplementedYet = async () => {
    console.warn("Be careful, a function implementation is missing")
}

class ServiceComponent {
    onCreate = notImplementedYet;
    onTrigger = notImplementedYet;
    onDestroy = notImplementedYet;

    constructor(componentName, description) {
        this.name = componentName;
        this.description = description;
    }

    setFunction(name, func) {
        if (func instanceof Function) {
            this[name] = func;
            return this;
        } else {
            throw new Error("The function must be a function");
        }
    }
}

class Action extends ServiceComponent {
    constructor(actionName, description = "no description", webhook) {
        super(actionName, description);
        this.webhook = webhook;
    }
}

class Reaction extends ServiceComponent {
    constructor(reactionName, description = "no description") {
        super(reactionName, description);
    }
}

class Service {
    constructor(serviceName) {
        this.name = serviceName;
        this.actions = [];
        this.reactions = [];
    }

    addAction(action) {
        if (action instanceof Action) {
            this.actions.push(action);
        } else {
            throw new Error("The action must be an instance of Action");
        }
    }

    addReaction(reaction) {
        if (reaction instanceof Reaction) {
            this.reactions.push(reaction);
        } else {
            throw new Error("The reaction must be an instance of Reaction");
        }
    }

    getAction(actionName) {
        return this.actions.find(action => action.name === actionName);
    }

    getReaction(reactionName) {
        return this.reactions.find(reaction => reaction.name === reactionName);
    }
}

module.exports = {
    Service,
    Action,
    Reaction
}
