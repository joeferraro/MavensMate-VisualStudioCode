'use strict';
import Promise = require('bluebird');

import { window, QuickPickItem, commands, Uri } from 'vscode';
import { promiseList, projectDirectory } from '../../src/workspace/projectList';

export interface projectQuickPickItem extends QuickPickItem {
    path: string;
}

export function showProjectQuickPick() : Thenable<any>{
    return promiseList().then((projects) => {
        return Promise.map(projects, buildQuickPickProject)
            .then(window.showQuickPick);
    });
}

function buildQuickPickProject(project: projectDirectory) : projectQuickPickItem{
    return {
        description: project.workspace,
        detail: project.path,
        label: project.name,
        path: project.path
    };
}

export function openProject(projectItem: projectQuickPickItem) {
    if(projectItem){
        let projectUri = Uri.parse(projectItem.path);
        return commands.executeCommand('vscode.openFolder', projectUri).then(null, console.error);
    } else {
        console.warn('No project selected');
        return;
    }
}

export function showProjectListAndOpen(): Thenable<any>{
    return showProjectQuickPick().then(openProject);
}