import expect = require('expect.js');
import nock = require('nock');
import Promise = require('bluebird');

import vscode = require('vscode');
import Command from '../../src/mavensmate/command';
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
                        expect(isAvailable).to.be(true);
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
        test("sends synchronous command", (testDone) => {
            let sendCommandNock = nock(mavensMateClientOptions.baseURL)
                .post('/execute', {"args":{"ui":true}})
                .matchHeader('Content-Type', 'application/json')
                .matchHeader('MavensMate-Editor-Agent', 'vscode')
                .query({"command":"open-ui","async":"0"})
                .reply(200);
            let openUICommand: Command = {
                command: 'open-ui',
                async: false,
                body: {
                    args: {
                        ui: true
                    }
                }
            };
                
            mavensMateClient.sendCommand(openUICommand)
                .then(() => {
                    sendCommandNock.done();
                }, assertIfError)
                .done(testDone);
        });

        test("sends async command", (testDone) => {
            let pendingResponse = {
                id: 'e14b82c0-2d98-11e6-a468-5bbc3ff5e056',
                status: 'pending'
            };
            let completedResponse = {
                id: "e14b82c0-2d98-11e6-a468-5bbc3ff5e056",
                complete: true,
                operation: "open-ui",
                result: {
                    "message": "Success"
                }
            }
            let sendCommandNock = nock(mavensMateClientOptions.baseURL)
                .post('/execute', {"args":{"ui":true}})
                .matchHeader('Content-Type', 'application/json')
                .matchHeader('MavensMate-Editor-Agent', 'vscode')
                .query({"command":"open-ui","async":"1"})
                .reply(200, pendingResponse);
            let checkStatusPendingNock = nock(mavensMateClientOptions.baseURL)
                .get('/status')
                .matchHeader('MavensMate-Editor-Agent', 'vscode')
                .query({"id": pendingResponse.id })
                .times(2)
                .reply(200, pendingResponse);
            let checkStatusCompleteNock = nock(mavensMateClientOptions.baseURL)
                .get('/status')
                .matchHeader('MavensMate-Editor-Agent', 'vscode')
                .query({"id": pendingResponse.id })
                .reply(200, completedResponse);
            
            let openUICommand: Command = {
                command: 'open-ui',
                async: true,
                body: {
                    args: {
                        ui: true
                    }
                }
            };
                
            mavensMateClient.sendCommand(openUICommand)
                .then((actualResponse) => {
                    expect(actualResponse.complete).to.be(true);
                    sendCommandNock.done();
                    checkStatusPendingNock.done();
                    checkStatusCompleteNock.done();
                }, assertIfError)
                .done(testDone);
        });
    });
});

function assertIfError(error){
    expect().fail(error);
}