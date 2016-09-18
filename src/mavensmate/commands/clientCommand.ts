import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { MavensMateClient } from '../mavensMateClient';
import { BaseCommand } from './baseCommand';
import Promise = require('bluebird');
import { ClientCommandInterface } from './clientCommandInterface';
import { MavensMateStatus } from '../../vscode/mavensMateStatus';

let mavensMateStatus = MavensMateStatus.getInstance();

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
            .then(this.onFinish, this.onFinish);
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

    onFinish(response): Promise<any>{
        mavensMateChannel.waitingOnCount--;
        if(response.error){
            mavensMateStatus.showAppIsUnavailable();
            mavensMateChannel.appendError(this.label + ': ' + response.error + '\n' + response.stack);
            return Promise.reject(response);
        } else {
            mavensMateStatus.showAppIsAvailable();
            mavensMateChannel.appendStatus(this.label + ': Finished');
            return Promise.resolve(response);
        }
    }
}