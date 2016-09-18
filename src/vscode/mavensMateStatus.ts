'use strict';
import { window, StatusBarAlignment, StatusBarItem } from 'vscode';
import { MavensMateChannel } from '../../src/vscode/mavensMateChannel';
import Promise = require('bluebird');

let mavensMateChannel = MavensMateChannel.getInstance();

export class MavensMateStatus {
    appStatus: StatusBarItem;
    thinkingIndex: number;
    thinkingMax: number = 5;
    
    private static _instance: MavensMateStatus = null;

    static getInstance(): MavensMateStatus{
        if(MavensMateStatus._instance == null){
            MavensMateStatus._instance = new MavensMateStatus();
        }
        return MavensMateStatus._instance;
    }
    
    constructor(){
        this.appStatus = window.createStatusBarItem(StatusBarAlignment.Left,2);
        this.appStatus.command = 'mavensmate.toggleOutput';
        this.appStatus.text = "MavensMate";
        this.appStatus.show();

        this.thinkingIndex = 0;
    }
    
    showAppIsThinking(){
        let thinkingLeftSpace = '$(dash)'.repeat(this.thinkingIndex);
        let thinkingRightSpace = '$(dash)'.repeat(this.thinkingMax - this.thinkingIndex);
        this.appStatus.text = `MavensMate [${thinkingLeftSpace}$(chevron-right)${thinkingRightSpace}]`;
        this.thinkingIndex++;
        if(this.thinkingIndex > this.thinkingMax){
            this.thinkingIndex = 0;
        }
    }
    
    showAppIsAvailable(){
        this.appStatus.text = "MavensMate $(check)";
    }
    
    showAppIsUnavailable(){
        this.appStatus.text = "MavensMate $(alert)";
    }
}