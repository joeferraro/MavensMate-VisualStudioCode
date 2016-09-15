import { ExtensionContext, Memento } from 'vscode';

export class TestExtensionContext implements ExtensionContext {
		subscriptions: { dispose(): any }[] = [];
        
		workspaceState: Memento;
        
		globalState: Memento;
        
		extensionPath: string;
        
		asAbsolutePath(relativePath: string): string{
            return relativePath;
        }

		storagePath: string;
}