import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class NewProject extends ClientCommand {
    static allowWithoutProject: boolean = true;

    static create(): BaseCommand {
        return new NewProject();
    }

    constructor() {
        super('New Project', 'new-project');
        this.async = false;
        this.body.args.ui = true;
    }
}