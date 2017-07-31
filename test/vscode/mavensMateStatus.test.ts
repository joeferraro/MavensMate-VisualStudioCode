import expect = require('expect.js');
import sinon = require('sinon');

import { MavensMateStatus } from '../../src/vscode/mavensMateStatus';

import vscode = require('vscode');

suite("MavensMateStatus", () => {
    let mavensMateStatus;
    
    suite("updateAppStatus", () => {
        let statusBarItem: any;
        let createStatusBarItemStub;
    
        setup(() => {
            statusBarItem = {};
            statusBarItem.show = sinon.stub();
            
            createStatusBarItemStub = sinon.stub(vscode.window, "createStatusBarItem");
            createStatusBarItemStub.returns(statusBarItem);
            
            mavensMateStatus = MavensMateStatus.create();

            expect(createStatusBarItemStub.calledOnce).to.be(true);
            expect(statusBarItem.show.calledOnce).to.be(true);
            expect(statusBarItem.text).to.equal("MavensMate");
            expect(statusBarItem.command).to.equal("mavensmate.toggleOutput");
        });
    
        teardown(() => {
            createStatusBarItemStub.restore();
        });
    
        suite("when MavensMateApp is Available", () => {
            test("it sets the statusBarItem to Check", () => {
                mavensMateStatus.showAppIsAvailable();
                expect(statusBarItem.text).to.equal("MavensMate $(check)");
            });
        });
        
        suite("when MavensMateApp is not Available", () => {
            test("it sets the statusBarItem to alert", () => {
                mavensMateStatus.showAppIsUnavailable();
                expect(statusBarItem.text).to.equal("MavensMate $(alert)");
            });
        });
    });
});