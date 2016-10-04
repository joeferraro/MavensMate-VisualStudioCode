import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class StartLogging extends ClientCommand {
    static create(): BaseCommand {
        return new StartLogging();
    }

    constructor() {
        super('Start Logging', 'start-logging');
        this.async = false;
        this.body.args.ui = true;
    }
}