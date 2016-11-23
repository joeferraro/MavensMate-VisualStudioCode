import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class OpenGlobalSettings extends ClientCommand {
    static create(): BaseCommand {
        return new OpenGlobalSettings();
    }

    constructor() {
        super('Open Settings', 'open-settings');
        this.async = false;
        this.body.args.ui = true;
        this.allowWithoutProject = true;
    }
}