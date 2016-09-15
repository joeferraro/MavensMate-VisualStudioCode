import fs = require('fs-promise');
import path = require('path');
import vscode = require('vscode');
import file = require('../workspace/jsonFile');
import Promise = require('bluebird');

export interface ProjectSettings {
    id: string;
    project_name: string;
    instanceUrl: string;
}

export function hasProjectSettings(projectPath?: string): Promise<any>{
    projectPath = projectPath || vscode.workspace.rootPath;
    return hasSettings(projectPath);
}

function hasSettings(projectPath: string): Promise<any> {
    let settingsPath = buildSettingsPath(projectPath);
    return fs.stat(settingsPath);
}

function buildSettingsPath(projectPath: string){
    return path.join(projectPath, 'config', '.settings');
}

export function getProjectSettings(projectPath?: string): ProjectSettings {
    projectPath = projectPath || vscode.workspace.rootPath;
    let settingsPath = buildSettingsPath(projectPath);
    return file.open(settingsPath);
}