import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewVisualforcePage extends ClientCommand {
    body: {
        args: {
            ui: boolean,
            type: string
        }
    }
    static create(): BaseCommand {
        return new NewVisualforcePage();
    }

    constructor() {
        super('New Visualforce Page');
        this.id = 'new-metadata';
        this.async = false;
        this.body = {
            args: {
                ui: true,
                type: 'ApexPage'
            }
        }
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}