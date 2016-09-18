import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewApexTrigger extends ClientCommand {
    static create(): BaseCommand {
        return new NewApexTrigger();
    }

    constructor() {
        super('New Apex Trigger', 'new-metadata');
        this.async = false;
        this.body.args.ui = true;
        this.body.args.type = 'ApexTrigger';
    }
}