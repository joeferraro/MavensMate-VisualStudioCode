import expect = require('expect.js');
import nock = require('nock');
import * as sinon from 'sinon';
import Promise = require('bluebird');

import vscode = require('vscode');
import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';
import { ClientCommand } from '../../src/mavensmate/commands/clientCommand';
import OpenUI = require('../../src/mavensmate/commands/openUI');
import CleanProject = require('../../src/mavensmate/commands/cleanProject');

suite("MavensMate Client", () => {
    let baseURL: string = 'http://localhost:55555';
    let mavensMateClient: MavensMateClient = MavensMateClient.getInstance();

    suite("getInstance", () => {
        teardown(() => {
            MavensMateClient.getInstance().baseURL = baseURL;
        });

        test("returns client", () => {
            let returnedClient = MavensMateClient.getInstance();

            expect(returnedClient).to.not.be(undefined);
            expect(typeof(returnedClient.isAppAvailable)).to.equal('function');
        });

        test("returns same client on subsequent calls", () => {
            let returnedClient = MavensMateClient.getInstance();
            returnedClient.baseURL = 'blahhhhh';

            let secondClient = MavensMateClient.getInstance();
            expect(returnedClient).to.be(secondClient);
            expect(secondClient.baseURL).to.equal('blahhhhh');
        });
    });

    suite("isAppAvailable", () => {
        let showAppIsAvailableSpy: sinon.SinonSpy;
        let showAppIsUnavailableSpy: sinon.SinonSpy;

        setup(() => {
            let mavensMateStatus = MavensMateStatus.getInstance();

            showAppIsAvailableSpy = sinon.spy(mavensMateStatus, 'showAppIsAvailable');
            showAppIsUnavailableSpy = sinon.spy(mavensMateStatus, 'showAppIsUnavailable');
        });

        teardown(() => {
            showAppIsAvailableSpy.restore();
            showAppIsUnavailableSpy.restore();
        });

        suite("server is up", () => {
            setup(() => {
                nock(baseURL)
                    .get('/app/home/index')
                    .reply(200, 'OK');
            });
 
            test("returns true", () => {
                return mavensMateClient.isAppAvailable()
                    .then(() =>{
                        expect(showAppIsAvailableSpy.calledOnce).to.be(true);
                        expect(showAppIsUnavailableSpy.calledOnce).to.be(false);
                    });
            });
        });

        suite("server is down", () => {
            test("returns an error", () => {
                return mavensMateClient.isAppAvailable()
                    .then(() =>{
                        expect(showAppIsAvailableSpy.calledOnce).to.be(false);
                        expect(showAppIsUnavailableSpy.calledOnce).to.be(true);
                    });
            });
        });
    });
    
    suite("sendCommand", () => {
        test("sends synchronous command", (testDone) => {
            let sendCommandNock = nock(baseURL)
                .post('/execute', {"args":{"ui":true}})
                .matchHeader('Content-Type', 'application/json')
                .matchHeader('MavensMate-Editor-Agent', 'vscode')
                .query({"command":"open-ui","async":"0"})
                .reply(200);
            let openUICommand: ClientCommand = new OpenUI();
                
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
                id: 'e14b82c0-2d98-11e6-a468-5bbc3ff5e056',
                complete: true,
                operation: "clean-project",
                result: {
                    "message": "Success"
                }
            }
            let sendCommandNock = nock(baseURL)
                .post('/execute', {"args":{"ui":false}})
                .matchHeader('Content-Type', 'application/json')
                .matchHeader('MavensMate-Editor-Agent', 'vscode')
                .query({"command":"clean-project","async":"1"})
                .reply(200, pendingResponse);
            let checkStatusPendingNock = nock(baseURL)
                .get('/execute/'+pendingResponse.id)
                .matchHeader('MavensMate-Editor-Agent', 'vscode')
                .times(2)
                .reply(200, pendingResponse);
            let checkStatusCompleteNock = nock(baseURL)
                .get('/execute/'+pendingResponse.id)
                .matchHeader('MavensMate-Editor-Agent', 'vscode')
                .reply(200, completedResponse);
            
            let cleanProjectCommand: ClientCommand = new CleanProject();
                
            mavensMateClient.sendCommand(cleanProjectCommand)
                .then((actualResponse) => {
                    console.log(actualResponse);
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