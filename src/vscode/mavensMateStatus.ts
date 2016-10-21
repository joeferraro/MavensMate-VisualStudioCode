'use strict';
import { window, StatusBarAlignment, StatusBarItem, Disposable } from 'vscode';
import { MavensMateChannel } from '../../src/vscode/mavensMateChannel';
import Promise = require('bluebird');

export class MavensMateStatus implements Disposable {
    appStatus: StatusBarItem;
    thinkingIndex: number;
    thinkingMax: number = 5;
    
    private static _instance: MavensMateStatus = null;

    static getInstance(): MavensMateStatus{
        if(MavensMateStatus._instance == null){
            MavensMateStatus._instance = MavensMateStatus.create();
        }
        return MavensMateStatus._instance;
    }

    static create(): MavensMateStatus {
        return new MavensMateStatus();
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

    dispose(){
        this.appStatus.dispose();
    }
}