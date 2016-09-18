import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class EditProject extends ClientCommand {
    body: {
        args: {
            ui: boolean
        }
    }
    static create(): BaseCommand {
        return new EditProject();
    }

    constructor() {
        super('Edit Project');
        this.id = 'edit-project';
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