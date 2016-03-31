"use strict";
import * as vscode from "vscode";

// Called when the extension is actiavted
export function activate(context: vscode.ExtensionContext) {
    let cloudforce: MavensMate = new MavensMate();

    console.log("MavensMate has been actiavted!");

    cloudforce.initialize();

    // let reconnect = vscode.commands.registerCommand("mm.reconnect", () => {
    //     // TODO
    // });
    
    // let fetchMetadata = vscode.commands.registerCommand("mm:fetch-metadata", () => {
    //     console.log("Fetching project metadata");
    // });

    // context.subscriptions.push(reconnect);
    // context.subscriptions.push(fetchMetadata);

}

export function deactivate() {}

class MavensMate {

    public initialize() {}

}
