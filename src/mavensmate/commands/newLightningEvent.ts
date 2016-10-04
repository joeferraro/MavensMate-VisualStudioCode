import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewLightningEvent extends ClientCommand {
    static create(): BaseCommand {
        return new NewLightningEvent();
    }

    constructor() {
        super('New Lightning Event', 'new-lightning-event');
        this.async = false;
        this.body.args.ui = true;
    }
}