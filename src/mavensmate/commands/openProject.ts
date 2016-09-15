import BaseCommand from '../command';
import { MavensMateChannel } from '../vscode/mavensMateChannel';

export class OpenProjectCommand implements BaseCommand {
  
    constructor(label:string) {
        super();
        this.label = label;
    }

    abstract execute():Promise<any>;

}