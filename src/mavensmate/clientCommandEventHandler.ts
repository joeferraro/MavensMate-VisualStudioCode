import Command from './command';
import Promise = require('bluebird');

interface ClientCommandEventHandler {
    onStart(command: Command): Promise<any>;
    onSuccess(command: Command, response: any): Promise<any>;
    onError(command: Command, response: any): Promise<any>;
}

export default ClientCommandEventHandler;