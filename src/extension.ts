import * as vscode from 'vscode';

let mavensMateMateExtension;

export function activate(context: vscode.ExtensionContext) {
    let { MavensMateExtension } = require('./mavensmateExtension');
    mavensMateMateExtension = new MavensMateExtension(context);
    mavensMateMateExtension.activate().catch(console.error);
}

export function deactivate() {
    mavensMateMateExtension.deactivate();
    mavensMateMateExtension = null;
}

process.on("unhandledRejection", function(reason, promise) {
    console.error(reason);
});