import expect = require('expect.js');
import assert = require('assert');
import nock = require('nock');
import Promise = require('bluebird');

import vscode = require('vscode');
import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';

suite("MavensMate Client", () => {
    let mavensMateClientOptions = {
        baseURL: 'http://localhost:55555'
    }; 
    let mavensMateClient = new MavensMateClient(mavensMateClientOptions);
    suite("isAppAvailable", () => {
        suite("server is up", () => {
            setup(() => {
                nock(mavensMateClientOptions.baseURL)
                    .get('/app/home/index')
                    .reply(200, 'OK');
            });

            test("returns true", () => {
                return mavensMateClient.isAppAvailable()
                    .then((isAvailable) =>{
                        expect(isAvailable).to.be.true;
                    });
            });
        });

        suite("server is down", () => {
            test("returns an error", () => {
                return mavensMateClient.isAppAvailable()
                    .then((isAvailable) =>{
                        expect().fail("Shouldn't be available");
                    })
                    .catch((requestError) => {
                        expect(requestError).to.not.be(undefined);
                    });
            });
        });
    });
    
    suite("sendCommand", () => {
        test("sends command", (testDone) => {
            let sendCommandNock : nock.Scope = nock(mavensMateClientOptions.baseURL)
                .post('/execute', {"args":{"ui":true}})
                .query({"command":"open-ui","async":"1"})
                .reply(200);
                
            mavensMateClient.sendCommand()
                .then(() => {
                    sendCommandNock.done();
                }, assertIfError)
                .done(testDone);
        });
    });
});

function assertIfError(error){
    assert.fail(null, null, error);
}