import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

class OpenUICommand extends ClientCommand {
    constructor() {
        super('Open UI');
        this.id = 'open-ui';
        this.async = false;
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}

exports.build = (): BaseCommand => {
    let command = new OpenUICommand();
    return command;
}