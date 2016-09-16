import fs = require('fs');
import path = require('path');
import { BaseCommand } from '../baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';

export function commandDirectory(): { [id: string]:  (outputChannel: MavensMateChannel) => BaseCommand } {
    let commandFiles = fs.readdirSync(__dirname);
    let commandBuilders: { [id: string]:  (outputChannel: MavensMateChannel) => BaseCommand } = {};
    for(let commandFile of commandFiles){
        if(commandFile.endsWith('js') && commandFile != 'index.js'){
            let commandBaseName = path.basename(commandFile, '.js');
            let commandKey = 'mavensmate.' + commandBaseName;
            let importedCommandFile = require('./' + commandFile);

            let buildCommand = importedCommandFile.build;
            commandBuilders[commandKey] = buildCommand;
        }
    }

    return commandBuilders;
}