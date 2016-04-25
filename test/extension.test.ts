import * as assert from 'assert';
import * as sinon from 'sinon';

import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

suite("Extension Tests", () => {
  suite("Hello World", () => {      
    let showInformationMessage;
    
    setup(() => {
      showInformationMessage = sinon.spy(vscode.window, 'showInformationMessage'); 
    });
    
    teardown(() => {
      showInformationMessage.restore(); 
    });
      
    test("sends 'hello world' to showInformationMessage", () => {
      return vscode.commands.executeCommand('extension.sayHello').then(() => {
        assert(showInformationMessage.calledOnce);
      });
    });
  });
});