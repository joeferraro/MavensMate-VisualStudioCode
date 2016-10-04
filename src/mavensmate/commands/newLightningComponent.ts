import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewLightningComponent extends ClientCommand {
    static create(): BaseCommand {
        return new NewLightningComponent();
    }

    constructor() {
        super('New Lightning Component', 'new-lightning-component');
        this.async = false;
        this.body.args.ui = true;
    }
}