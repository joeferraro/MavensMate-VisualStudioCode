import * as assert from 'assert';
import * as sinon from 'sinon';

import fs = require('fs');

import * as file from  '../../src/workspace/jsonFile';

suite('file', () => {
    let openFileSyncStub : sinon.SinonStub;

    suite('when it returns a json file', () => {
        let testFileName = 'testfile.txt';
        setup(() => {
            openFileSyncStub = sinon.stub(fs, 'readFileSync');
            openFileSyncStub.withArgs(testFileName).returns('{"isValid": true, "myString": "test string"}'); 
        });

        test('returns parsed json object', () => {
            let returnedObject = file.open(testFileName);
            assert.equal(returnedObject.isValid, true);
            assert.equal(returnedObject.myString, 'test string'); 
        });

        teardown(() => {
            openFileSyncStub.restore(); 
        });
    });
});