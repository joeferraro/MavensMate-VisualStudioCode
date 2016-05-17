
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

export function getListAsync() : Promise<any> {
    let projects : Promise<any>[] = [];
    let config : appConfig = mavensMateAppConfig.getConfig();
    
    for(var workspace of config.mm_workspace){
        let listProjectsInWorkplace = (fileList) => {
            return listProjectsInWorkspaceFileList(workspace, fileList); 
        };
        let listProjectsInWorkplaceIfExists = fs.stat(workspace)
            .then((directoryInfo) => {
                if(directoryInfo.isDirectory()){
                    return fs.readdir(workspace).then(listProjectsInWorkplace);
                }
            });
        
        projects.push(listProjectsInWorkplaceIfExists);
    }
    return Promise.all(projects).then(flattenToListOfProjects);
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
    return fs.stat(projectPath)
        .then((fileInfo) => {
            if(fileInfo.isDirectory()){
                return hasProjectSettings(projectPath).then((hasSettings) => {
                    if(hasSettings){
                        return { name: fileName, path: projectPath, workspace: baseName(workspace) };
                    }
                });
            }
        });
}

function hasProjectSettings(projectPath){
    let settingsPath = path.join(projectPath, 'config', '.settings');
    return fileExists(settingsPath);
}

function fileExists(filePath){
    return fs.stat(filePath)
        .then(returnTrue, returnFalse);
}

function returnTrue(){
    return true;
}

function returnFalse(){
    return false;
}

function flattenToListOfProjects(listsOfProjects){
    return Array.prototype.concat.apply([], listsOfProjects); // http://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
}

function baseName(path){
    return path.split(/[\\/]/).pop();
}