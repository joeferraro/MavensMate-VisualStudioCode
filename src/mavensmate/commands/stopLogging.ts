import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class StopLogging extends ClientCommand {
    static create(): BaseCommand {
        return new StopLogging();
    }

    constructor() {
        super('Stop Logging', 'stop-logging');
        this.async = false;
        this.body.args.ui = true;
    }
}