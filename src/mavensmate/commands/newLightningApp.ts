import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewLightningApp extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new NewLightningApp();
    }

    constructor() {
        super('New Lightning App');
        this.id = 'new-lightning-app';
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