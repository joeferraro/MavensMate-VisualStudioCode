import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class FlushLogs extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new FlushLogs();
    }

    constructor() {
        super('Flush Logs');
        this.id = 'flush-logs';
        this.async = true;
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