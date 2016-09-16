import { BaseCommand } from './baseCommand';
import ProjectQuickPick = require('../../vscode/projectQuickPick');

class OpenProjectCommand extends BaseCommand {
    constructor() {
        super('Open Project');
    }

    execute(): Thenable<any> {
        return Promise.resolve(ProjectQuickPick.showProjectListAndOpen());
    }
}

exports.build = (): BaseCommand => {
    let command = new OpenProjectCommand();
    return command;
}