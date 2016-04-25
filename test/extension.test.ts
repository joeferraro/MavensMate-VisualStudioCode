import * as assert from 'assert';
import * as sinon from 'sinon';

import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

suite("Extension Tests", () => {
    suite("Hello World", () => {
       
       test("sends 'hello world' to showInformationMessage", () => {
          var showInformationMessage = sinon.spy(vscode.window, 'showInformationMessage'); 
          vscode.commands.executeCommand('extension.sayHello').then(() => {
            assert(showInformationMessage.calledOnce);
            showInformationMessage.restore(); 
          });
       });
    });
});