import expect = require('expect.js');
import * as sinon from 'sinon';
import Promise = require('bluebird');
import vscode = require('vscode');
import axios, { AxiosStatic } from 'axios';
import moxios = require('moxios');
import querystring = require('querystring');

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
            expect(typeof (returnedClient.isAppAvailable)).to.equal('function');
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
                moxios.install();
            });

            teardown(() => {
                moxios.uninstall();
            });

            test("returns true", (done) => {
                mavensMateClient.isAppAvailable();
                moxios.wait(() => {
                    let request = moxios.requests.mostRecent();
                    request.respondWith({
                        status: 200,
                        response: 'OK'
                    }).then(() => {
                        expect(showAppIsAvailableSpy.calledOnce).to.be(true);
                        expect(showAppIsUnavailableSpy.calledOnce).to.be(false);
                        done();
                    });
                });
            });
        });

        suite("server is down", () => {

            setup(() => {
                moxios.install();
            });

            teardown(() => {
                moxios.uninstall();
            });

            test("returns an error", (done) => {
                mavensMateClient.isAppAvailable();
                moxios.wait(() => {
                    let request = moxios.requests.mostRecent();
                    request.respondWith({
                        status: 'ERR',
                        response: 'ERR'
                    }).then(() => {
                        expect(showAppIsAvailableSpy.calledOnce).to.be(false);
                        expect(showAppIsUnavailableSpy.calledOnce).to.be(true);
                        done();
                    });
                });
            });
        });
    });

    suite("sendCommand", () => {

        setup(() => {
            moxios.install();
        });

        teardown(() => {
            moxios.uninstall();
        });

        test("sends synchronous command", (done) => {
            let openUICommand: ClientCommand = new OpenUI();

            mavensMateClient.sendCommand(openUICommand).then(() => {
                done()
            }, assertIfError);

            moxios.wait(() => {
                let request = moxios.requests.mostRecent();
                expect(request.headers['Content-Type']).to.be('application/json');
                expect(request.headers['MavensMate-Editor-Agent']).to.be('vscode');
                expect(request.config.data).to.be('{"args":{"ui":true}}');
                request.respondWith({
                    status: 200,
                    response: 'OK'
                });
            });
        });

        test("sends Asynchronous command", (done) => {
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
            let cleanProjectCommand: ClientCommand = new CleanProject();

            mavensMateClient.sendCommand(cleanProjectCommand)
                .then(finalResponse => {
                    expect(finalResponse.complete).to.be(true);
                    done();
                });

            moxios.wait(() => {
                let request = moxios.requests.mostRecent();
                expect(request.headers['Content-Type']).to.be('application/json');
                expect(request.headers['MavensMate-Editor-Agent']).to.be('vscode');
                expect(request.config.data).to.be('{"args":{"ui":false}}');
                request.respondWith({
                    status: 200,
                    response: pendingResponse
                });
                moxios.wait(() => {
                    let request = moxios.requests.mostRecent();
                    expect(request.headers['MavensMate-Editor-Agent']).to.be('vscode');
                    request.respondWith({
                        status: 200,
                        response: pendingResponse
                    });
                    moxios.wait(() => {
                        let request = moxios.requests.mostRecent();
                        expect(request.headers['MavensMate-Editor-Agent']).to.be('vscode');
                        request.respondWith({
                            status: 200,
                            response: pendingResponse
                        });
                        moxios.wait(() => {
                            let request = moxios.requests.mostRecent();
                            expect(request.headers['MavensMate-Editor-Agent']).to.be('vscode');
                            request.respondWith({
                                status: 200,
                                response: completedResponse
                            });
                        }, 550);
                    }, 550);
                }, 550);
            });
        });
    });
});

function assertIfError(error) {
    expect().fail(error);
}
