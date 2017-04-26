import path = require('path');
import * as fs from './readDirAsync';
import Promise = require('bluebird');
import * as vscode from 'vscode';

export interface resourceBundle {
    name: string,
    path: string
}

export function promiseList() : Promise<resourceBundle[]> {
    let resourceBundlesPath = buildResourceBundlesPath();

    let listResourceBundlesInWorkspace = fs.readdir(resourceBundlesPath)
        .then(resourceBundlesFromFileList, console.error);
    
    return listResourceBundlesInWorkspace;
}

function buildResourceBundlesPath(): string{
    let workspaceRoot = vscode.workspace.rootPath;
    let resourceBundlesPath = path.join(workspaceRoot, 'resource-bundles');
    return resourceBundlesPath;
}

function resourceBundlesFromFileList(fileList) : Promise<resourceBundle[]> {
    let resourceBundles: Promise<resourceBundle>[] = [];
    for(let fileName of fileList){
        if(isResourceBundle(fileName)){
            resourceBundles.push(getResourceBundleFrom(fileName));
        }
    }
    
    return Promise.all(resourceBundles);
}

function isResourceBundle(fileName: string){
    return !fileName.startsWith('.');
}

function getResourceBundleFrom(fileName): Promise<resourceBundle>{
    let resourceBundlesPath = buildResourceBundlesPath();
    let resourceBundlePath = path.join(resourceBundlesPath, fileName);
    let resourceBundleInfo: resourceBundle = {
        name: fileName, path: resourceBundlePath
    };
    return Promise.resolve(resourceBundleInfo);
}
