import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { MavensMateClient } from '../mavensMateClient';
import { BaseCommand } from './baseCommand';
import Promise = require('bluebird');
import { ClientCommandInterface } from './clientCommandInterface';

let mavensMateChannel: MavensMateChannel = MavensMateChannel.getInstance();
let mavensMateClient: MavensMateClient = MavensMateClient.getInstance();

export abstract class ClientCommand extends BaseCommand implements ClientCommandInterface {
    id: string;
    async: boolean;

    constructor(label: string) {
        super(label);
    }

    execute(): Thenable<any> {
        return this.onStart()
            .bind(this)
            .then(this.sendCommand)
            .then(this.onDone, this.onDone);
    }

    onStart(): Promise<any>{
        mavensMateChannel.waitingOnCount++;
        return Promise.resolve().then(() => {
            let statusText: string = this.label + ': Starting';
            return mavensMateChannel.appendStatus(statusText);
        });
    }

    sendCommand(): Promise<any>{
        return mavensMateClient.sendCommand(this);
    }

    onDone(response): Promise<any>{
        mavensMateChannel.waitingOnCount--;
        return Promise.resolve().then(() => {
            if(response.error){
                mavensMateChannel.appendError(this.label + ': ' + response.error + '\n' + response.stack);
            } else {
                mavensMateChannel.appendStatus(this.label + ': Finished');
            }
            return response;
        });
    }
}