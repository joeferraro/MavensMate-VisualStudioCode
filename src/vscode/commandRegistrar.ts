import vscode = require('vscode');
import commandIndex = require('../mavensmate/commands/index');

export function registerCommands(context: vscode.ExtensionContext){
    let registerCommand = vscode.commands.registerCommand;
    let registerTextEditorCommand = vscode.commands.registerTextEditorCommand;  
    let commandDirectory = commandIndex.commandDirectory();

    for(let commandKey in commandDirectory){
        let Command = commandDirectory[commandKey];
        console.log(Command.prototype.execute);

        if(Command.prototype.execute){
            registerCommand(commandKey, (selectedResource?: vscode.Uri) => {
                try{
                    let command = Command.create();
                    return command.execute(selectedResource);
                } catch(commandException){
                    logAsErrorAndThrow(commandException);
                }
            });
        }

        if(Command.prototype.executeTextEditor){
            let commandKeyWithTextEditor = commandKey + '.withTextEditor';
            registerTextEditorCommand(commandKeyWithTextEditor, (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
                try{
                    let command = Command.create();
                    return command.executeTextEditor(textEditor, edit);
                } catch(commandException){
                    logAsErrorAndThrow(commandException);
                }
            });
        }
    }
}

function logAsErrorAndThrow(commandException){
    console.error(commandException);
    throw(commandException);
}