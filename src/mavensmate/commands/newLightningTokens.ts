import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewLightningTokens extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new NewLightningTokens();
    }

    constructor() {
        super('New Lightning Tokens');
        this.id = 'new-lightning-tokens';
        this.async = false;
        this.body = {
            args: {
                ui: true
            }
        }
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}