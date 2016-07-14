import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';

export class CommandInvoker {
    client: MavensMateClient;
    status: MavensMateStatus;
    command: any;
    invokeProxy: () => Promise<any>;

    static Create(client: MavensMateClient, status: MavensMateStatus, command: any){
        return new CommandInvoker(client, status, command);
    }

    constructor(client: MavensMateClient, status: MavensMateStatus, command: any){
        this.client = client;
        this.status = status;
        this.command = command;
        this.invokeProxy = () => { return this.invoke.apply(this) }
    }

    invoke(){
        this.status.commandStarted();
        return this.client.sendCommand(this.command).then(() => {
            let withError = false;
            return this.status.commandStopped(withError);
        }, (error) => {
            let withError = true;
            return this.status.commandStopped(withError);
        });
    }
}