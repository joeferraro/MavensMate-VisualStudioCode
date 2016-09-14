# MavensMate for VS Code
[MavensMate](http://mavensmate.com/) plugin for the Visual Studio Code editor

# When Cloning This For Development
1. Open the extension project in VS Code
2. Open a Terminal with ```ctrl+` ```
3. Run ```npm install```
4. Develop! [VS Code Extensibility Reference](https://code.visualstudio.com/docs/extensionAPI/overview)

# Organization
The point of entry for the code is src/extension.ts where the extension is registered.
## src 
Is the main directory of code for this project.
### mavensmate
Code specifically relevant to the MavensMate app. Should avoid referencing vscode.
### vscode
Provides an interface to vscode, encapsulating some concepts relevant to mavensmate.
### workspace
Encapsulates code relevant to the workspace where projects are contained and the file system.

## test
Where tests are defined.

# Commands
For a command to be registered with VSCode, it has to be registered within the package.json.

We define further configuration for Commands in src/mavensmate/clientCommands.ts

The interface for a command is defined in src/mavensmate/command.ts

If you'd like to see how a command is sent to the MavensMate App, check out src/mavensmate/clientCommands.ts