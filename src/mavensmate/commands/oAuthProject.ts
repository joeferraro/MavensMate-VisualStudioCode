import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

class OAuthProjectCommand extends ClientCommand {
    static create(): BaseCommand {
        return new OAuthProjectCommand();
    }

    constructor() {
        super('oAuth Project', 'oauth-project');
        this.async = false;
        this.body.args.ui = true;
    }
}

export = OAuthProjectCommand;