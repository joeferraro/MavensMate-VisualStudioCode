import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewVisualforcePage extends ClientCommand {
    static create(): BaseCommand {
        return new NewVisualforcePage();
    }

    constructor() {
        super('New Visualforce Page', 'new-metadata');
        this.async = false;
        this.body.args.ui = true;
        this.body.args.type = 'ApexPage';
    }
}