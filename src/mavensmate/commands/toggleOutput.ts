import { BaseCommand } from '../baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import ProjectQuickPick = require('../../vscode/projectQuickPick');

class ToggleOutputCommand extends BaseCommand {
    constructor(outputChannel: MavensMateChannel) {
        super(outputChannel);
    }

    execute(): Thenable<any> {
        return this.outputChannel.toggle();
    }
}

exports.build = (outputChannel: MavensMateChannel): BaseCommand => {
    let command = new ToggleOutputCommand(outputChannel);
    return command;
}