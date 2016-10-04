import vscode = require('vscode');
import commandIndex = require('../mavensmate/commands/index');
import { BaseCommand } from '../mavensmate/commands/baseCommand';
import OAuthProject = require('../mavensmate/commands/oAuthProject');
import { hasProjectSettings } from '../mavensmate/projectSettings';

export function registerCommands(context: vscode.ExtensionContext, withProject: boolean){
    let registerCommand = vscode.commands.registerCommand;
    let registerTextEditorCommand = vscode.commands.registerTextEditorCommand;  
    let commandDirectory = commandIndex.commandDirectory();

    for(let commandKey in commandDirectory){
        let Command = commandDirectory[commandKey];
        console.log(Command.prototype.execute);

        if(Command.prototype.execute){
            registerCommand(commandKey, (selectedResource?: vscode.Uri) => {
                if(withProject || Command.allowWithoutProject === true){
                    try{
                        let command = Command.create();
                        return command.execute(selectedResource).then(null, handleAuthenticationError);
                    } catch(commandException){
                        logAsErrorAndThrow(commandException);
                    }
                } else {
                    return promptToOpenProject(commandKey);
                }
            });
        }

        if(Command.prototype.executeTextEditor){
            let commandKeyWithTextEditor = commandKey + '.withTextEditor';
            registerTextEditorCommand(commandKeyWithTextEditor, (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
                if(withProject || Command.allowWithoutProject === true){
                    try{
                        let command = Command.create();
                        return command.executeTextEditor(textEditor, edit).then(null, handleAuthenticationError);
                    } catch(commandException){
                        logAsErrorAndThrow(commandException);
                    }
                } else {
                    return promptToOpenProject(commandKey);
                }
            });
        }
        
    }
}

function promptToOpenProject(commandKey){
    let message = `${commandKey} requires an open MavensMate project`;
    let openProject = 'Open Project';
    return vscode.window.showWarningMessage(message, openProject)
        .then((answer) => {
            if(answer == openProject){
                return vscode.commands.executeCommand('mavensmate.openProject');
            }
        });
}

function logAsErrorAndThrow(commandException){
    console.error(commandException);
    throw(commandException);
}

function handleAuthenticationError(response){
    let error: string = response.error;
    if(error && error.endsWith('Project requires re-authentication.')){
        console.log('Need to re-authenticate.');
        return new OAuthProject().execute();
    }     
}