import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewApexClass extends ClientCommand {
    body: {
        args: {
            ui: boolean,
            type: string
        }
    }
    static create(): BaseCommand {
        return new NewApexClass();
    }

    constructor() {
        super('New Apex Class');
        this.id = 'new-metadata';
        this.async = false;
        this.body = {
            args: {
                ui: true,
                type: 'ApexClass'
            }
        }
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}