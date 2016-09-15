import expect = require('expect.js');
import clientCommands = require('../../src/mavensmate/clientCommands');

suite('clientCommands', () => {
    test('can find basic command', () => {
        let openUICommand = clientCommands.list()['mavensmate.openUI'];

        expect(openUICommand).to.not.be(undefined);
        expect(openUICommand.command).to.be('open-ui');
    });
});