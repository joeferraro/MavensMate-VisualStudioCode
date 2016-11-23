import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';

import { MavensMateExtension } from '../src/mavensMateExtension';

suite("Extension", () => {
    let baseExtension: vscode.Extension<any>;
    let mavensMateExtension: MavensMateExtension;
    let mavensMateExtensionCreateStub: sinon.SinonStub;
    let mavensMateExtensionActivateStub: sinon.SinonStub;
    
    setup(() => {
        
        baseExtension = vscode.extensions.getExtension("DavidHelmer.mavensmate");
        assert.notEqual(undefined, baseExtension);

        mavensMateExtension = MavensMateExtension.create(null);
        
        mavensMateExtensionCreateStub = sinon.stub(MavensMateExtension, "create").returns(mavensMateExtension);
        mavensMateExtensionActivateStub = sinon.stub(mavensMateExtension, "activate");
    });
    
    test("activates", () => {
        return baseExtension.activate()
            .then(() => {
                assert(mavensMateExtensionCreateStub.calledOnce);
                assert(mavensMateExtensionCreateStub.neverCalledWith(null));
                assert(mavensMateExtensionActivateStub.calledOnce);
            });
    });
});