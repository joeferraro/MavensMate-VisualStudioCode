'use strict';
import Promise = require('bluebird');

import { window, QuickPickItem, commands, Uri } from 'vscode';
import { promiseList, staticResource } from '../../src/workspace/staticResourceList';

export interface staticResourceQuickPickItem extends QuickPickItem {
    path: string;
}

export function showStaticResourceQuickPick() : Thenable<any>{
    return promiseList().then((staticResources) => {
        return Promise.map(staticResources, buildQuickPickStaticResource)
            .then(window.showQuickPick);
    });
}

function buildQuickPickStaticResource(staticResource: staticResource) : staticResourceQuickPickItem{
    return {
        description: staticResource.name,
        detail: staticResource.path,
        label: staticResource.name,
        path: staticResource.path
    };
}