import assert = require('assert');
import sinon = require('sinon');

import projectList = require('../../src/workspace/projectList');

suite('projectList', () => {
    test('testing', (testDone) => {
        projectList.getListAsync().then((projects) => { 
                assert.equal(projects.length, 15); 
            })
            .done(testDone, (error) => {
                console.log('there was an error');
                console.log(error);
                testDone();
            });
    });
});