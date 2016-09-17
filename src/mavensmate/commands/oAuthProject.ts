import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class OAuthProjectCommand extends ClientCommand {
    static create(): BaseCommand {
        return new OAuthProjectCommand();
    }

    constructor() {
        super('oAuth Project');
        this.id = 'oauth-project';
        this.async = false;
    }

    execute(): Thenable<any> {
        return super.execute();
    }
}