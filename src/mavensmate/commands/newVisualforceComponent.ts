import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewVisualforceComponent extends ClientCommand {
    body: {
        args: {
            ui: boolean,
            type: string
        }
    }
    static create(): BaseCommand {
        return new NewVisualforceComponent();
    }

    constructor() {
        super('New Visualforce Component');
        this.id = 'new-metadata';
        this.async = false;
        this.body = {
            args: {
                ui: true,
                type: 'ApexComponent'
            }
        }
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}