import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class Deploy extends ClientCommand {
    static create(): BaseCommand {
        return new Deploy();
    }

    constructor() {
        super('Deploy', 'deploy');
        this.async = false;
        this.body.args.ui = true;
    }
}