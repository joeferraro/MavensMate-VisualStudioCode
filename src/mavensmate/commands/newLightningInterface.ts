import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewLightningInterface extends ClientCommand {
    static create(): BaseCommand {
        return new NewLightningInterface();
    }

    constructor() {
        super('New Lightning Interface', 'new-lightning-interface');
        this.async = false;
        this.body.args.ui = true;
    }
}