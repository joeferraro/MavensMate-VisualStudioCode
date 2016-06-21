import expect = require('expect.js');
import mavensMateCommands = require('../../src/mavensmate/mavensMateCommands');

suite('mavensMateCommands', () => {
    test('can find basic command', () => {
        let openUICommand = mavensMateCommands['mavensmate.openUI'];

        expect(openUICommand).to.not.be(undefined);
        expect(openUICommand.mavensmate.command).to.be('open-ui');
    });
});