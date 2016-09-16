import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();

class ToggleOutputCommand extends BaseCommand {
    constructor() {
        super('Toggle Output');
    }

    execute(): Thenable<any> {
        return mavensMateChannel.toggle();
    }
}

exports.build = (): BaseCommand => {
    let command = new ToggleOutputCommand();
    return command;
}