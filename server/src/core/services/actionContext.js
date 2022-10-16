const mongoose = require('mongoose');

class ActionContext {
    #callStack = [];
    #dirty = false;

    constructor(contextKind, actionData, action, reaction) {
        this.env = {};
        this.#callStack = [action[contextKind].bind(action), reaction[contextKind].bind(reaction)];

        if (actionData instanceof mongoose.Model) {
            this.actionData = actionData;
        } else {
            throw new Error("actionData must be a mongoose model");
        }
    }

    addEnvVariables(newEnvVariables) {
        // Append new extra data to the context
        if (!newEnvVariables instanceof Object) {
            throw new Error("addEnvVariables() only accepts objects as argument");
        }
        this.env = {...this.env, ...newEnvVariables};
    }

    setActionData(key, value) {
        if (key === "_id" || key === "id") {
            throw new Error("Cannot set or modify action id");
        }
        this.actionData[key] = value;
        this.#dirty = true;
    }

    getActionData(key) {
        return this.actionData[key];
    }

    dirty() {
        // Manually marking the context as dirty, not recommended
        this.#dirty = true;
    }

    async next(newEnvVariables, options) {
        // Popping the next function from the call stack
        let nextFunction = this.#callStack.shift();

        // Append new extra data to the context
        if (!newEnvVariables instanceof Object) {
            throw new Error("next() only accepts objects as argument");
        }
        this.env = {...this.env, ...newEnvVariables};

        if (options?.forceSave && this.#dirty) {
            await this.actionData.save();
        }

        // Calling the next function or ending the context
        await (nextFunction ? nextFunction(this) : this.end());
    }

    async end() {
        // Saving context changes if the context is dirty
        if (this.#dirty) {
            await this.actionData.save();
        }
    }
}

class CreateActionContext extends ActionContext {
    constructor(actionData, action, reaction) {
        super("create", actionData, action, reaction);
    }
}

class TriggerActionContext extends ActionContext {
    constructor(actionData, action, reaction) {
        super("trigger", actionData, action, reaction);
    }
}

module.exports = {
    CreateActionContext,
    TriggerActionContext
}
