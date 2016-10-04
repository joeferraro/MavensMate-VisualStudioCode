import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class ExecuteApex extends ClientCommand {
    static create(): BaseCommand {
        return new ExecuteApex();
    }

    constructor() {
        super('Execute Apex', 'execute-apex');
        this.async = false;
        this.body.args.ui = true;
    }
}