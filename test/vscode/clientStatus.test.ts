import assert = require('assert');
import sinon = require('sinon');
import Promise = require('bluebird');

import { ClientStatus } from '../../src/vscode/clientStatus';

import vscode = require('vscode');

let mavensMateClientOptions = {
    baseURL: 'http://localhost:55555'
}; 
suite("ClientStatus", () => {
    let clientStatus: ClientStatus;        
    let statusBarItem;
    let createStatusBarItemStub;

    setup(() => {
        statusBarItem = {};
        statusBarItem.show = sinon.stub();
        statusBarItem.hide = sinon.stub();
        
        createStatusBarItemStub = sinon.stub(vscode.window, "createStatusBarItem");
        createStatusBarItemStub.returns(statusBarItem);
        
        clientStatus = ClientStatus.Create();
    });
    
    teardown(() => {
        createStatusBarItemStub.restore();
    });

    test('onStart sets text to SQUIRREL and shows', (testDone) => {
        clientStatus.onStart(null).then(() => {
            assert.equal(statusBarItem.text, "$(squirrel)");
            assert(statusBarItem.show.calledOnce);
        }).then(testDone);
    });
    
    test('onSuccess sets text to thumbsUp and shows', (testDone) => {
        clientStatus.onSuccess(null, null)
            .then(() => {
                assert(statusBarItem.hide.calledOnce);  
            })
            .done(testDone);
        Promise.delay(500).then(() => {
            assert(statusBarItem.show.calledOnce);   
            assert.equal(statusBarItem.text, "$(thumbsup)");  
        });         
    });

    test('onError sets text to thumbsDown and shows', (testDone) => {
        
        clientStatus.onError(null, null)
            .then(() => {
                assert(statusBarItem.hide.calledOnce);
            })
            .done(testDone);
        Promise.delay(500).then(() => {
            assert(statusBarItem.show.calledOnce);   
            assert.equal(statusBarItem.text, "$(thumbsdown)");  
        });          
    });
});