import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class StopLogging extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new StopLogging();
    }

    constructor() {
        super('Stop Logging');
        this.id = 'stop-logging';
        this.async = true;
        this.body = {
            args: {
                ui: false
            }
        }
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}