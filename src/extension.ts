import * as vscode from 'vscode';

let mavensMateMateExtension;

export function activate(context: vscode.ExtensionContext) {
    let { MavensMateExtension } = require('./mavensMateExtension');
    mavensMateMateExtension = MavensMateExtension.create(context);
    return mavensMateMateExtension.activate();
}

export function deactivate() {
    mavensMateMateExtension.deactivate();
    mavensMateMateExtension = null;
}

process.on("unhandledRejection", function(reason, promise) {
    console.error(reason);
});