import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewLightningTokens extends ClientCommand {
    static create(): BaseCommand {
        return new NewLightningTokens();
    }

    constructor() {
        super('New Lightning Tokens', 'new-lightning-tokens');
        this.async = false;
        this.body.args.ui = true;
    }
}