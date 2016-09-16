import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import Promise = require('bluebird');

export abstract class BaseCommand {
    label: string;
    outputChannel: MavensMateChannel;

    constructor(outputChannel: MavensMateChannel) {
        this.outputChannel = outputChannel;
    }

    abstract execute(): Thenable<any>;
}