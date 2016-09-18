import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewApexTrigger extends ClientCommand {
    body: {
        args: {
            ui: boolean,
            type: string
        }
    }
    static create(): BaseCommand {
        return new NewApexTrigger();
    }

    constructor() {
        super('New Apex Trigger');
        this.id = 'new-metadata';
        this.async = false;
        this.body = {
            args: {
                ui: true,
                type: 'ApexTrigger'
            }
        }
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}