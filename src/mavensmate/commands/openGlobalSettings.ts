import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class OpenGlobalSettings extends ClientCommand {
    static create(): BaseCommand {
        return new OpenGlobalSettings();
    }

    constructor() {
        super('Open Settings');
        this.id = 'open-settings';
        this.async = false;
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}