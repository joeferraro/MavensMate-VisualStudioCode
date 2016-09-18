import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class StartLogging extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new StartLogging();
    }

    constructor() {
        super('Start Logging');
        this.id = 'start-logging';
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