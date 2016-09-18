import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewApexClass extends ClientCommand {
    static create(): BaseCommand {
        return new NewApexClass();
    }

    constructor() {
        super('New Apex Class', 'new-metadata');
        this.async = false;
        this.body.args.ui = true;
        this.body.args.type = 'ApexClass';
    }
}