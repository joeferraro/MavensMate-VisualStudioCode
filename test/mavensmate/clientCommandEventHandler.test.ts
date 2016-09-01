import assert = require('assert');
import Command from '../../src/mavensmate/command';
import ClientCommandEventHandler from '../../src/mavensmate/ClientCommandEventHandler';

suite('ClientCommandEventHandler interface', () => {
    test('it exists', () => {
        let testHandler: ClientCommandEventHandler = {
            onStart: (command: Command) => {
                console.log(command);
            },
            onSuccess: (command: Command, response: any) => {
                console.log(command);
            },
            onError: (command: Command, response: any) => {
                console.log(command);
            }
        }

        assert.equal('function', typeof(testHandler.onStart));
        assert.equal('function', typeof(testHandler.onSuccess));
        assert.equal('function', typeof(testHandler.onError));
    });
});