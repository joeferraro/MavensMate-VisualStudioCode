import expect = require('expect.js');
import nock = require('nock');
import Promise = require('bluebird');

import vscode = require('vscode');
import { MavensMateClient, Command } from '../../src/mavensmate/mavensMateClient';

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
            let sendCommandNock = nock(mavensMateClientOptions.baseURL)
                .post('/execute', {"args":{"ui":true}})
                .matchHeader('Content-Type', 'application/json')
                .matchHeader('MavensMate-Editor-Agent', 'vscode')
                .query({"command":"open-ui","async":"0"})
                .reply(200);
            let openUICommand: Command = {
                command: 'open-ui',
                async: false,
                args: {
                    ui: true
                }
            };
                
            mavensMateClient.sendCommand(openUICommand)
                .then(() => {
                    sendCommandNock.done();
                }, assertIfError)
                .done(testDone);
        });
    });
});

function assertIfError(error){
    expect().fail(error);
}