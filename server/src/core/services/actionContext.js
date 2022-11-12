const mongoose = require('mongoose');

class ActionContext {
    #callStack = [];
    #dirty = false;

    constructor(contextKind, actionData, action, reaction) {
        this.env = {};
        this.#callStack = [action[contextKind].bind(action), reaction[contextKind].bind(reaction), this.updateActionLastRun];

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
        this.actionData.data[key] = value;
        this.#dirty = true;
    }

    getActionData(key) {
        return this.actionData.data[key];
    }

    dirty() {
        // Manually marking the context as dirty, not recommended
        this.#dirty = true;
    }

    async next(newEnvVariables = {}, options = {}) {
        // Append new extra data to the context
        if (!newEnvVariables instanceof Object) {
            throw new Error("next() only accepts objects as argument");
        }
        this.env = {...this.env, ...newEnvVariables};

        // Popping the next function from the call stack
        let nextFunction = this.#callStack.shift();

        if (nextFunction) {
            if (options?.forceSave && this.#dirty) {
                this.actionData.markModified('data');
                await this.actionData.save();
            }
            // If there is a next function, call it
            await nextFunction(this);
        } else {
            // If there is no next function, end the context
            await this.end();
        }
    }

    async end() {
        // Saving context changes if the context is dirty
        if (this.#dirty) {
            this.actionData.markModified('data');
            await this.actionData.save();
        }
        return this.actionData;
    }

    async updateActionLastRun(ctx) {
        ctx.actionData.lastRun = new Date();
        await ctx.next();
    }
}

class CreateActionContext extends ActionContext {
    constructor(actionData, payload, action, reaction) {
        super("create", actionData, action, reaction);
        this.payload = payload;
        // We set dirty as true to force the context to save the new action
        super.dirty();
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
