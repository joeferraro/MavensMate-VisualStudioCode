import { BaseCommand } from './baseCommand';
import Promise = require('bluebird');
import { MavensMateStatus } from '../../vscode/mavensMateStatus';
import { MavensMateClient } from '../mavensMateClient';
export class SalesforceTest {
    testNameOrPath?: string;
    methodNames?: string[];
}
export abstract class ClientCommand extends BaseCommand {
    id: string;
    async: boolean;
    mavensMateStatus: MavensMateStatus;
    mavensMateClient: MavensMateClient;
    body: {
        name?: string,
        paths?: string[],
        classes?: string[],
        tests?: SalesforceTest[],
        skipCoverage?: boolean,
        callThrough?: boolean,
        force?: boolean,
        soql?: string,
        global?: boolean,
        args: {
            ui?: boolean,
            type?: string,
            origin?: string
        }
    }

    constructor(label: string, id: string) {
        super(label);
        this.id = id;
        this.body = {
            args: {}
        };

        this.mavensMateStatus = MavensMateStatus.getInstance();
        this.mavensMateClient = MavensMateClient.getInstance();
    }

    execute(): Thenable<any> {
        return this.onStart()
            .bind(this)
            .then(this.sendCommand)
            .then(this.onSuccess)
            .catch(this.onFailure);
    }

    onStart(): Promise<any>{
        this.mavensMateChannel.waitingOnCount++;
        return Promise.resolve().then(() => {
            let statusText: string = `${this.label}: Starting`;
            return this.mavensMateChannel.appendStatus(statusText);
        });
    }

    sendCommand(): Promise<any>{
        if(this.async === undefined){
            this.async = true;
        }
        if(this.body.args.ui === undefined){
            this.body.args.ui = false;
        }

        return this.mavensMateClient.sendCommand(this);
    }

    onSuccess(response): Promise<any>{
        this.mavensMateChannel.waitingOnCount--;
        if(this.mavensMateChannel.waitingOnCount === 0){
            this.mavensMateStatus.showAppIsAvailable();
        }        
        return this.mavensMateChannel.appendStatus(`${this.label}: Finished`);
    }

    onFailure(response): Promise<any>{
        this.mavensMateChannel.waitingOnCount--;
        if(response.error){
            let error: string = response.error;
            this.mavensMateChannel.appendError(`${this.label}: ${error}\n${response.stack}`);
        } else {
            this.mavensMateChannel.appendError(`${this.label}: Failed\n${response}`);   
        }
        this.mavensMateStatus.showAppIsUnavailable();
        console.error(`MavensMate Client Error Response:\n ${response}`);
        return Promise.reject(response);
    }
}