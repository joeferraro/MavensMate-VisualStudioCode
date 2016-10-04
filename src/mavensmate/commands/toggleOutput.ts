import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';

module.exports = class ToggleOutput extends BaseCommand {
    static allowWithoutProject: boolean = true;
    static create(){
        return new ToggleOutput();
    }

    constructor() {
        super('Toggle Output');
    }

    execute(): Thenable<any> {
        return this.mavensMateChannel.toggle();
    }
}