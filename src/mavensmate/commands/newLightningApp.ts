import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewLightningApp extends ClientCommand {
    static create(): BaseCommand {
        return new NewLightningApp();
    }

    constructor() {
        super('New Lightning App', 'new-lightning-app');
        this.async = false;
        this.body.args.ui = true;
    }
}