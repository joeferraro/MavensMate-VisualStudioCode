
import path = require('path');

import fs = require('fs-promise');
import Promise = require('bluebird');
import mavensMateAppConfig = require('../mavensmate/mavensMateAppConfig');

export interface projectDirectory {
    name: string,
    path: string
}

interface appConfig {
    mm_workspace: string[];
}

export function promiseList() : Promise<any> {
    let projects : Promise<any>[] = [];
    let config : appConfig = mavensMateAppConfig.getConfig();
    
    for(var workspace of config.mm_workspace){
        let listProjectsInWorkplace = fs.readdir(workspace)
            .then((fileList) => {
                return listProjectsInWorkspaceFileList(workspace, fileList);
            }, logErrorToConsole);
        
        projects.push(listProjectsInWorkplace);
    }
    return Promise.all(projects).then(flattenToListOfProjects);
}

function logErrorToConsole(error) {
    console.log(error);
}

function listProjectsInWorkspaceFileList(workspace, fileList) : Promise<any> {
    let projects : Promise<any>[] = [];
    for(var fileIndex in fileList){
        let fileName = fileList[fileIndex];
        if(notHiddenFile(fileName)){
            projects.push(getProjectFromFileName(workspace, fileName));
        }
    }
    
    return Promise.all(projects);
}

function notHiddenFile(fileName){
    return !fileName.startsWith('.');
}

function getProjectFromFileName(workspace, fileName){
    let projectPath = path.join(workspace, fileName);
    let returnProjectInfo = () => {
        return { name: fileName, path: projectPath, workspace: baseName(workspace) };
    };
    return hasProjectSettings(projectPath)
        .then(returnProjectInfo, logErrorToConsole);
}

function baseName(path){
    return path.split(/[\\/]/).pop();
}

function hasProjectSettings(projectPath){
    let settingsPath = path.join(projectPath, 'config', '.settings');
    return fs.stat(settingsPath);
}

function flattenToListOfProjects(listsOfProjects){
    return Array.prototype.concat.apply([], listsOfProjects); // http://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
}
