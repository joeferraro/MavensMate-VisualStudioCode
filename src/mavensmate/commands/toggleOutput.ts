import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();

module.exports = class ToggleOutput extends BaseCommand {
    static create(){
        return new ToggleOutput();
    }

    constructor() {
        super('Toggle Output');
    }

    execute(): Thenable<any> {
        return mavensMateChannel.toggle();
    }
}