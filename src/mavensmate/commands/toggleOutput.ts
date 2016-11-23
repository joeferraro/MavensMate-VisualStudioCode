import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';

module.exports = class ToggleOutput extends BaseCommand {
    static create(){
        return new ToggleOutput();
    }

    constructor() {
        super('Toggle Output');
        this.allowWithoutProject = true;
    }

    execute(): Thenable<any> {
        return this.mavensMateChannel.toggle();
    }
}