'use strict';
import Promise = require('bluebird');

import { window, QuickPickItem, commands, Uri } from 'vscode';
import { promiseList, resourceBundle } from '../../src/workspace/resourceBundleList';

export interface resourceBundleQuickPickItem extends QuickPickItem {
    path: string;
}

export function showResourceBundleQuickPick() : Thenable<any>{
    return promiseList().then((resourceBundles) => {
        if(resourceBundles && resourceBundles.length > 0){
            return Promise.map(resourceBundles, buildQuickPickResourceBundle)
                .then(window.showQuickPick);
        } else {
            return window.showWarningMessage('No Resource Bundles Found');
        }
    });
}

function buildQuickPickResourceBundle(resourceBundle: resourceBundle) : resourceBundleQuickPickItem{
    return {
        description: resourceBundle.name,
        detail: resourceBundle.path,
        label: resourceBundle.name,
        path: resourceBundle.path
    };
}