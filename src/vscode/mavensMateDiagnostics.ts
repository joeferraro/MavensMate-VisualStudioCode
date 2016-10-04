import * as vscode from 'vscode';

export class MavensMateDiagnostics {
    diagnostics: vscode.DiagnosticCollection;

    private static _instance: MavensMateDiagnostics = null;

    static getInstance(): MavensMateDiagnostics {
        if(MavensMateDiagnostics._instance == null){
            MavensMateDiagnostics._instance = new MavensMateDiagnostics();
        }
        return MavensMateDiagnostics._instance;
    }

    constructor() {
        this.diagnostics = vscode.languages.createDiagnosticCollection('mavensmate');
    }
}