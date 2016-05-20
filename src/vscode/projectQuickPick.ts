'use strict';
import Promise = require('bluebird');

import { window, QuickPickItem } from 'vscode';
import { promiseList, projectDirectory } from '../../src/workspace/projectList';

export function showProjectQuickPick() : Thenable<any>{
    return promiseList().then((projects) => {
        return Promise.map(projects, buildQuickPickProject)
            .then(window.showQuickPick);
    });
}

function buildQuickPickProject(project: projectDirectory) : QuickPickItem{
    return {
        description: project.workspace,
        detail: project.path,
        label: project.name 
    };
}