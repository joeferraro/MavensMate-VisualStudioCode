import assert = require('assert');
import sinon = require('sinon');

import { MavensMateClient } from '../../src/mavensmate/mavensMateClient';
import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';
import { MavensMateChannel } from '../../src/vscode/mavensMateChannel';

import vscode = require('vscode');

let mavensMateClientOptions = {
    baseURL: 'http://localhost:55555'
}; 
suite("MavensMateStatus", () => {
    let mavensMateClient = new MavensMateClient(mavensMateClientOptions);
    let mavensMateChannel = MavensMateChannel.Create();
    let mavensMateStatus;
    
    suite("updateAppStatus", () => {
        let statusBarItem;
        let createStatusBarItemStub;
    
        setup(() => {
            statusBarItem = {};
            statusBarItem.show = sinon.stub();
            
            createStatusBarItemStub = sinon.stub(vscode.window, "createStatusBarItem");
            createStatusBarItemStub.returns(statusBarItem);
            
            mavensMateStatus = new MavensMateStatus(mavensMateClient, mavensMateChannel);
        });
    
        teardown(() => {
            createStatusBarItemStub.restore();
        });
    
        suite("when MavensMateApp is Available", () => {
            let mavensMateClientStub;
            
            setup(() => {
                mavensMateClientStub = sinon.stub(MavensMateClient.prototype, 'isAppAvailable');
                mavensMateClientStub.returns(Promise.resolve(true));
            });
        
            teardown(() => {
                mavensMateClientStub.restore();
            });
            
            test("it sets the statusBarItem to Check", () => {
                return mavensMateStatus.updateAppStatus().then(() => {
                    assert(statusBarItem.show.calledOnce);
                    assert.equal(statusBarItem.text, "MavensMate $(check)");
                });
            });
        });
        
        suite("when MavensMateApp is not Available", () => {
            let mavensMateClientStub;
            
            setup(() => {
                mavensMateClientStub = sinon.stub(MavensMateClient.prototype, 'isAppAvailable');
                mavensMateClientStub.returns(Promise.reject("404"));
            });
            
            teardown(() => {
                mavensMateClientStub.restore(); 
            });
            
            test("it sets the statusBarItem to alert", () => {
                return mavensMateStatus.updateAppStatus().then(() => {
                    assert(statusBarItem.show.calledOnce);
                    assert.equal(statusBarItem.text, "MavensMate $(alert)");
                });
            });
        });
    });

    suite('commandStarted', () => {
        let statusBarItem;
        let createStatusBarItemStub;
    
        setup(() => {
            statusBarItem = {};
            statusBarItem.show = sinon.stub();
            
            createStatusBarItemStub = sinon.stub(vscode.window, "createStatusBarItem");
            createStatusBarItemStub.onCall(1).returns(statusBarItem);
            
            mavensMateStatus = new MavensMateStatus(mavensMateClient, mavensMateChannel);
        });

        test('sets text to SQUIRREL and shows', () => {
            mavensMateStatus.commandStarted();

            assert.equal(statusBarItem.text, "$(squirrel)");
            assert(statusBarItem.show.calledOnce);
        });
    
        teardown(() => {
            createStatusBarItemStub.restore();
        });
    });

    suite('commandStopped', () => {
        let statusBarItem;
        let createStatusBarItemStub;
    
        setup(() => {
            statusBarItem = {};
            statusBarItem.show = sinon.stub();
            statusBarItem.hide = sinon.stub();
            
            createStatusBarItemStub = sinon.stub(vscode.window, "createStatusBarItem");
            createStatusBarItemStub.onCall(1).returns(statusBarItem);
            
            mavensMateStatus = new MavensMateStatus(mavensMateClient, mavensMateChannel);
        });

        suite('without error', () => {
            test('sets text to thumbsUp and shows', (testDone) => {
                
                mavensMateStatus.commandStopped(false)
                    .then(() => {
                        assert(statusBarItem.hide.calledOnce);
                    })
                    .done(testDone);

                assert.equal(statusBarItem.text, "$(thumbsup)");
                assert(statusBarItem.show.calledOnce);                
            });
        });

        suite('with error', () => {
            test('sets text to thumbsUp and shows', (testDone) => {
                
                mavensMateStatus.commandStopped(true)
                    .then(() => {
                        assert(statusBarItem.hide.calledOnce);
                    })
                    .done(testDone);

                assert.equal(statusBarItem.text, "$(thumbsdown)");
                assert(statusBarItem.show.calledOnce);                
            });
        });

    
        teardown(() => {
            createStatusBarItemStub.restore();
        });
    });
});