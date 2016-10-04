import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class EditProject extends ClientCommand {
    static create(): BaseCommand {
        return new EditProject();
    }

    constructor() {
        super('Open Salesforce', 'open-sfdc');
        this.async = false;
        this.body.args.ui = true;
    }
}