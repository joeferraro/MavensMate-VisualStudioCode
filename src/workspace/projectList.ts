import path = require('path');
import * as fs from './readDirAsync';
import Promise = require('bluebird');
import mavensMateAppConfig = require('../mavensmate/mavensMateAppConfig');
import { ProjectSettings } from '../mavensmate/projectSettings';

export interface projectDirectory {
    name: string,
    path: string,
    workspace: string
}

interface appConfig {
    mm_workspace: string[];
}

export function promiseList() : Promise<any> {
    let projects : Promise<any>[] = [];
    let config : appConfig = mavensMateAppConfig.getConfig();
    for(let workspace of config.mm_workspace){
        let listProjects = (fileList) => {
            return listProjectsInWorkspaceFileList(workspace, fileList);
        };
        let listProjectsInWorkplace = fs.readdir(workspace)
            .then(listProjects, console.error);
        
        projects.push(listProjectsInWorkplace);
    }
    return Promise.all(projects).then(flattenToListOfProjects);
}

function listProjectsInWorkspaceFileList(workspace, fileList) : Promise<any> {
    let projects: Promise<any>[] = [];
    for(let fileName of fileList){
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
    
    return Promise.resolve().then(() => {
        if(ProjectSettings.hasProjectSettings(projectPath)){
            return { name: fileName, path: projectPath, workspace: baseName(workspace) };
        } else {
            console.warn(`MavensMate: No project settings found at ${ projectPath }`);
        }
    });
}

function baseName(path){
    return path.split(/[\\/]/).filter(notBlank).pop();
}

function notBlank(string: String){
    return string != null && string.length > 0
}

function flattenToListOfProjects(listsOfProjects){
    return Array.prototype.concat.apply([], listsOfProjects).filter(project => project);
}
