import path = require('path');
import * as operatingSystem from  '../../src/workspace/operatingSystem';
import * as jsonFile from '../../src/workspace/jsonFile';

export function getConfig(){
    let configFileDirectory = getUserHomeDirectory();
    let configFileName = '.mavensmate-config.json';
    let appConfigFilePath = path.join(configFileDirectory, configFileName);
    
    return jsonFile.open(appConfigFilePath);
}

function getUserHomeDirectory() {
    if(operatingSystem.isWindows()){
        return process.env.USERPROFILE;
    } else if(operatingSystem.isMac() || operatingSystem.isLinux()){
        return process.env.HOME;
    } else {
        throw new operatingSystem.UnexpectedPlatformError('Was not windows, mac, or linux');
    }
}