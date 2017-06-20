import path = require('path');
import * as fs from './readDirAsync';
import Promise = require('bluebird');
import * as vscode from 'vscode';

export interface staticResource {
    name: string,
    path: string
}

export function promiseList() : Promise<staticResource[]> {
    let staticResourcesPath = buildStaticResourcesPath();

    let listStaticResourcesInWorkspace = fs.readdir(staticResourcesPath)
        .then(staticResourcesFromFileList);
    
    return listStaticResourcesInWorkspace;
}

function buildStaticResourcesPath(): string{
    let workspaceRoot = vscode.workspace.rootPath;
    let staticResourcesPath = path.join(workspaceRoot, 'src', 'staticresources');
    return staticResourcesPath;
}

function staticResourcesFromFileList(fileList) : Promise<staticResource[]> {
    let staticResources: Promise<staticResource>[] = [];
    for(let fileName of fileList){
        if(isStaticResource(fileName)){
            staticResources.push(getStaticResourceFrom(fileName));
        }
    }
    
    return Promise.all(staticResources);
}

function isStaticResource(fileName: string){
    return !(fileName.startsWith('.') || fileName.includes('-meta.xml'));
}

function getStaticResourceFrom(fileName): Promise<staticResource>{
    let staticResourcesPath = buildStaticResourcesPath();
    let staticResourcePath = path.join(staticResourcesPath, fileName);
    let staticResourceInfo =  {
        name: fileName, path: staticResourcePath
    };
    return Promise.resolve(staticResourceInfo);
}
