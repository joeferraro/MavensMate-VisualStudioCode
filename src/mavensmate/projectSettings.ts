import fs = require('fs-promise');
import path = require('path');
import vscode = require('vscode');
import file = require('../workspace/jsonFile');
import Promise = require('bluebird');

export class ProjectSettings {
    id: string;
    projectName: string;
    instanceUrl: string;

    private static _instances: { [projectPath:string]: ProjectSettings } = {};

    static getProjectSettings(projectPath?: string): ProjectSettings {
        projectPath = projectPath || vscode.workspace.rootPath;

        console.log('projectsettings');
        console.log(projectPath);

        if(projectPath && !ProjectSettings._instances[projectPath]){
            let settingsPath = buildSettingsPath(projectPath);
            ProjectSettings._instances[projectPath] = file.open(settingsPath);            
        }

        return ProjectSettings._instances[projectPath];
    }
}

function buildSettingsPath(projectPath: string){
    return path.join(projectPath, 'config', '.settings');
}

export function hasProjectSettings(projectPath?: string): Promise<any>{
    projectPath = projectPath || vscode.workspace.rootPath;
    return hasSettings(projectPath);
}

function hasSettings(projectPath: string): Promise<any> {
    let settingsPath = buildSettingsPath(projectPath);
    return fs.stat(settingsPath);
}
