import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewVisualforceComponent extends ClientCommand {
    static create(): BaseCommand {
        return new NewVisualforceComponent();
    }

    constructor() {
        super('New Visualforce Component', 'new-metadata');
        this.async = false;
        this.body.args.ui = true;
        this.body.args.type = 'ApexComponent';
    }
}