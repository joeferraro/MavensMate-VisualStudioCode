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
        projectPath = workspaceRootIfBlank(projectPath);

        if(projectPath && !ProjectSettings._instances[projectPath]){
            let settingsPath = buildSettingsPath(projectPath);
            console.info(`Retrieving settings at path:  ${ settingsPath }`);
            ProjectSettings._instances[projectPath] = file.open(settingsPath);            
        }

        return ProjectSettings._instances[projectPath];
    }

    static hasProjectSettings(projectPath?: string): boolean {
        projectPath = workspaceRootIfBlank(projectPath);
        console.log(`Checking if project path has settings ${projectPath}`);
        console.log(projectPath);
        console.log(ProjectSettings._instances[projectPath]);
        if(!ProjectSettings._instances[projectPath]){
            ProjectSettings.getProjectSettings(projectPath);
        }
        console.log(ProjectSettings._instances[projectPath]);
        console.log(`Checking if project path has settings ${ProjectSettings._instances[projectPath] !== null}`);
        return ProjectSettings._instances[projectPath] !== null;
    }
}

function workspaceRootIfBlank(projectPath?: string): string {
    return projectPath || vscode.workspace.rootPath;
}

function buildSettingsPath(projectPath: string){
    return path.join(projectPath, 'config', '.settings');
}