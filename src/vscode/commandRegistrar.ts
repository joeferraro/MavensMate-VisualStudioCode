import vscode = require('vscode');
import commandIndex = require('../mavensmate/commands/index');

export function registerCommands(){
    let registerCommand = vscode.commands.registerCommand;
    let commandDirectory = commandIndex.commandDirectory();

    for(let commandKey in commandDirectory){
        let Command = commandDirectory[commandKey];

        registerCommand(commandKey, (selectedResource?: vscode.Uri) => {
            let command = Command.create();
            return command.invoke(selectedResource);
        });
    }
}