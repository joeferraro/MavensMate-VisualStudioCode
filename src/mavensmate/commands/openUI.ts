import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class OpenUI extends ClientCommand {
    static allowWithoutProject: boolean = true;
    static create(): BaseCommand {
        return new OpenUI();
    }

    constructor() {
        super('Open UI');
        this.id = 'open-ui';
        this.async = false;
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}