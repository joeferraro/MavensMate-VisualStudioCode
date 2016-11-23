import fs = require('fs');
import path = require('path');
import { BaseCommand } from './baseCommand';
import { MavensMateChannel } from '../../vscode/mavensMateChannel';
import { MavensMateClient } from '../mavensMateClient';

interface CommandDirectoryInterface { [id: string]: any }

export function commandDirectory(): CommandDirectoryInterface {
    let commandFiles = fs.readdirSync(__dirname);
    let commandDirectory: CommandDirectoryInterface = { };
    for(let commandFile of commandFiles){
        if(commandFile.endsWith('js')){
            let commandBaseName = path.basename(commandFile, '.js');
            let commandKey = 'mavensmate.' + commandBaseName;
            console.info(`MavensMate: Attempting to import ${commandKey}`);

            let importedCommand = require('./' + commandFile);
            if(importedCommand.create){
                console.info(`MavensMate: Imported ${commandKey}`);
                commandDirectory[commandKey] = importedCommand;
            } else {
                console.warn(`MavensMate: ${commandKey} not imported because it does not have a static create method`);
            }
        }
    }

    return commandDirectory;
}