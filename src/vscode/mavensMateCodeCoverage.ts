import * as vscode from 'vscode';

export class MavensMateCodeCoverage {
    decorationType: vscode.TextEditorDecorationType;
    uncoveredRangesByPath: { [fsPath: string]: vscode.Range[]}
    percentCoveredByPath: { [fsPath: string]: number}
    coverageStatus: vscode.StatusBarItem;

    private static _instance: MavensMateCodeCoverage = null;

    static getInstance(): MavensMateCodeCoverage {
        if(MavensMateCodeCoverage._instance == null){
            MavensMateCodeCoverage._instance = new MavensMateCodeCoverage();
        }

        return MavensMateCodeCoverage._instance;
    }

    constructor(){
        this.decorationType = this.getDecorationType();
        this.uncoveredRangesByPath = {};
        this.percentCoveredByPath = {};
        this.coverageStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,1);
        this.coverageStatus.command = 'mavensmate.getCoverage';
        
        this.refreshActivePercentCovered();
        this.coverageStatus.show();
        vscode.window.onDidChangeActiveTextEditor((textEditor) => {
            this.onDidChangeActiveTextEditor(textEditor);
        });
    }

    private getDecorationType(): vscode.TextEditorDecorationType{
        let options: vscode.DecorationRenderOptions = {
            isWholeLine: true,
            backgroundColor: 'rgba(215, 44, 44, 0.3)'
        };
        return vscode.window.createTextEditorDecorationType(options);
    }

    private onDidChangeActiveTextEditor(textEditor: vscode.TextEditor){
        this.refreshUncoveredDecorations();
        this.refreshActivePercentCovered();
    }

    report(fsPath, percentCovered: number, uncoveredLines: number[]){
        let uncoveredRanges: vscode.Range[] = uncoveredLines.map(asRange);
        this.uncoveredRangesByPath[fsPath] = uncoveredRanges;
        this.percentCoveredByPath[fsPath] = percentCovered;
        this.refreshActivePercentCovered();
        this.refreshUncoveredDecorations();
    }

    private refreshUncoveredDecorations(){
        for(let textEditor of vscode.window.visibleTextEditors){
            let uncoveredRanges = this.uncoveredRangesByPath[textEditor.document.fileName];
            if(uncoveredRanges !== undefined){
                textEditor.setDecorations(this.decorationType, uncoveredRanges);
            }
        }
    }

    private refreshActivePercentCovered(){
        if(vscode.window.activeTextEditor && vscode.window.activeTextEditor.document){
            let activePath = vscode.window.activeTextEditor.document.uri.fsPath;
            if(this.percentCoveredByPath[activePath] != undefined){
                let percentCovered = this.percentCoveredByPath[activePath];
                this.coverageStatus.text = `${percentCovered}% Covered`;
            } else {
                this.coverageStatus.text = `Get Test Coverage`;
            }
        }
    }
}

function asRange(lineNumber){
    let vscodeLineNumber = lineNumber-1;
    let start = new vscode.Position(vscodeLineNumber, 0);
    let end = new vscode.Position(vscodeLineNumber, 0);
    return new vscode.Range(start, end);
}