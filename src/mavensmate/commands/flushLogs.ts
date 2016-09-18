import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class FlushLogs extends ClientCommand {
    static create(): BaseCommand {
        return new FlushLogs();
    }

    constructor() {
        super('Flush Logs', 'flush-logs');
        this.async = false;
        this.body.args.ui = true;
    }
}