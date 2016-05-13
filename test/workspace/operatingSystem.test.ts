import * as assert from 'assert';
import * as sinon from 'sinon';

import os = require('os');

import * as operatingSystem from  '../../src/workspace/operatingSystem';


suite('operatingSystem', () => {
    let platformStub : any;
    suite("when on a mac (darwin)", () => {
        setup(() => {
            platformStub = sinon.stub(os, 'platform');
            platformStub.returns('darwin');
        });
        
        test("isMac is true", () => {
            assert.equal(operatingSystem.isMac(), true);
        });
        test("isWindows is false", () => {
            assert.equal(operatingSystem.isWindows(), false);
        });
        test("isLinux is false", () => {
            assert.equal(operatingSystem.isLinux(), false);
        });
        
        teardown(() => {
            platformStub.restore();
        });
    });
    
    suite("when on a linux machine", () => {
        setup(() => {
            platformStub = sinon.stub(os, 'platform');
            platformStub.returns('linux');
        });
        
        test("isMac is false", () => {
            assert.equal(operatingSystem.isMac(), false);
        });
        test("isWindows is false", () => {
            assert.equal(operatingSystem.isWindows(), false);
        });
        test("isLinux is true", () => {
            assert.equal(operatingSystem.isLinux(), true);
        });
        
        teardown(() => {
            platformStub.restore();
        });
    });
    
    suite("when on a windows machine (win32)", () => {
        setup(() => {
            platformStub = sinon.stub(os, 'platform');
            platformStub.returns('win32');
        });
        
        test("isMac is false", () => {
            assert.equal(operatingSystem.isMac(), false);
        });
        test("isWindows is true", () => {
            assert.equal(operatingSystem.isWindows(), true);
        });
        test("isLinux is false", () => {
            assert.equal(operatingSystem.isLinux(), false);
        });
        
        teardown(() => {
            platformStub.restore();
        });
    });
});