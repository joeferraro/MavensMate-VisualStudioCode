import assert = require('assert');
import Command from '../../src/mavensmate/command';

suite('command definition', () => {
    test('it exists', () => {
        let testCommand: Command = {
            command: 'testcommand',
            async: false
        };

        assert.equal(false, testCommand.async);
    });
});