import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class Deploy extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new Deploy();
    }

    constructor() {
        super('Deploy');
        this.id = 'deploy';
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