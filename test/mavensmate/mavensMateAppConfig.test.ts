import assert = require('assert');
import sinon = require('sinon');
import path = require('path');

import operatingSystem = require('../../src/workspace/operatingSystem');
import jsonFile = require('../../src/workspace/jsonFile');

import mavensMateAppConfig = require('../../src/mavensmate/mavensMateAppConfig');

suite('mavensMate App Config', () => {
    let originalUserProfile = process.env.USERPROFILE;
    let originalHome = process.env.HOME;
    
    let isLinuxStub : sinon.SinonStub;
    let isMacStub : sinon.SinonStub;
    let isWindowsStub : sinon.SinonStub;
    
    let windowsJson = { isWindows: true };
    let nonWindowsJson = { isWindows: false };
    let openStub : sinon.SinonStub;
    
    setup(() => {
        process.env.USERPROFILE = 'userprofiletest';
        process.env.HOME = 'hometest';
        
        openStub = sinon.stub(jsonFile, 'open');
        openStub.withArgs(path.normalize('userprofiletest/.mavensmate-config.json')).returns(windowsJson);
        openStub.withArgs(path.normalize('hometest/.mavensmate-config.json')).returns(nonWindowsJson); 
    });
    
    teardown(() => { 
        process.env.USERPROFILE = originalUserProfile;
        process.env.HOME = originalHome;
        openStub.restore();
    });
    
    suite('when on a mac', () => {
        setup(() => {
            isLinuxStub = sinon.stub(operatingSystem, 'isLinux').returns(false);
            isMacStub = sinon.stub(operatingSystem, 'isMac').returns(true);
            isWindowsStub = sinon.stub(operatingSystem, 'isWindows').returns(false);
        });
        
        test('it uses home', () => {
            mavensMateAppConfig.getConfig();
            
            sinon.assert.calledWith(openStub, path.normalize('hometest/.mavensmate-config.json'));
            sinon.assert.neverCalledWith(openStub, path.normalize('userprofiletest/.mavensmate-config.json'));
        });
        
        test('it parses correct json', () => {
            let returnedJson = mavensMateAppConfig.getConfig();
            
            assert.equal(returnedJson.isWindows, false);
        });
        
        teardown(() => {
            isLinuxStub.restore();
            isMacStub.restore();
            isWindowsStub.restore();
        });
    });
    
    suite('when on windows', () => {
        setup(() => {
            isLinuxStub = sinon.stub(operatingSystem, 'isLinux').returns(false);
            isMacStub = sinon.stub(operatingSystem, 'isMac').returns(false);
            isWindowsStub = sinon.stub(operatingSystem, 'isWindows').returns(true);
        });
        
        test('it uses userprofile', () => {
            mavensMateAppConfig.getConfig();
            
            sinon.assert.calledWith(openStub, path.normalize('userprofiletest/.mavensmate-config.json'));
            sinon.assert.neverCalledWith(openStub, path.normalize('hometest/.mavensmate-config.json'));
        });
        
        test('it parses correct json', () => {
            let returnedJson = mavensMateAppConfig.getConfig();
            
            assert.equal(returnedJson.isWindows, true);
        });
        
        teardown(() => {
            isLinuxStub.restore();
            isMacStub.restore();
            isWindowsStub.restore();
        });
    });
    
    suite('when on linux', () => {
        setup(() => {
            isLinuxStub = sinon.stub(operatingSystem, 'isLinux').returns(true);
            isMacStub = sinon.stub(operatingSystem, 'isMac').returns(false);
            isWindowsStub = sinon.stub(operatingSystem, 'isWindows').returns(false);
        });
        
        test('it uses home', () => {
            mavensMateAppConfig.getConfig();
            
            sinon.assert.calledWith(openStub, path.normalize('hometest/.mavensmate-config.json'));
            sinon.assert.neverCalledWith(openStub, path.normalize('userprofiletest/.mavensmate-config.json'));
        });
        
        test('it parses correct json', () => {
            let returnedJson = mavensMateAppConfig.getConfig();
            
            assert.equal(returnedJson.isWindows, false);
        });
        
        teardown(() => {
            isLinuxStub.restore();
            isMacStub.restore();
            isWindowsStub.restore();
        });
    });
});
