import Command from './command';

interface ClientCommandEventHandler {
    onStart(command: Command);
    onSuccess(command: Command, response: any);
    onError(command: Command, response: any);
}

export default ClientCommandEventHandler;