import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewLightningInterface extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new NewLightningInterface();
    }

    constructor() {
        super('New Lightning Interface');
        this.id = 'new-lightning-interface';
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