import assert = require('assert');
import Command from '../../src/mavensmate/command';
import ClientCommandEventHandler from '../../src/mavensmate/ClientCommandEventHandler';

suite('ClientCommandEventHandler interface', () => {
    test('it exists', () => {
        let testHandler: ClientCommandEventHandler = {
            onStart: (command: Command) => {
                console.log(command);
                return null;
            },
            onSuccess: (command: Command, response: any) => {
                console.log(command);
                return null;
            },
            onError: (command: Command, response: any) => {
                console.log(command);
                return null;
            },
            dispose: () => {}
        }

        assert.equal('function', typeof(testHandler.onStart));
        assert.equal('function', typeof(testHandler.onSuccess));
        assert.equal('function', typeof(testHandler.onError));
    });
});