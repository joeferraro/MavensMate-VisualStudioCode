import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewProject extends ClientCommand {
    static create(): BaseCommand {
        return new NewProject();
    }

    constructor() {
        super('New Project');
        this.id = 'new-project';
        this.async = false;
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}