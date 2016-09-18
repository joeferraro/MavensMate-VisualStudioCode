import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewProject extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static allowWithoutProject: boolean = true;

    static create(): BaseCommand {
        return new NewProject();
    }

    constructor() {
        super('New Project');
        this.id = 'new-project';
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