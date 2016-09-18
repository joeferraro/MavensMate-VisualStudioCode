import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class ExecuteApex extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new ExecuteApex();
    }

    constructor() {
        super('Execute Apex');
        this.id = 'execute-apex';
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