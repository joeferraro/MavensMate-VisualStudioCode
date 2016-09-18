import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewLightningComponent extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new NewLightningComponent();
    }

    constructor() {
        super('New Lightning Component');
        this.id = 'new-lightning-component';
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