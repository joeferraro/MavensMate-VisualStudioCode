# MavensMate for VS Code
[![Build Status](https://travis-ci.org/kidtsunami/MavensMate-VisualStudioCode.svg?branch=master)](https://travis-ci.org/kidtsunami/MavensMate-VisualStudioCode)

[MavensMate](http://mavensmate.com/) plugin for the Visual Studio Code editor that aims to replicate the functionality of the Eclipse-based Salesforce IDE. Its goal is to allow developers to work inside Sublime Text for all their Salesforce-related tasks.

* Create & Edit Salesforce.com projects with specific package metadata
* Create & compile Apex Classes, Apex Trigger, Visualforce Pages, Visualforce Components
* Create & Edit Lightning Components (v7 only)
* Retrieve & compile other types of Salesforce.com metadata
* Run Apex test methods and visualize test successes/failures & coverage
* Deploy metadata to other Salesforce.com orgs
* Apex Execute Anonymous
* Stream Apex Logs to your local filesystem
* Apex & Visualforce Code Assist

## Issues

All issues are managed by the [central MavensMate project](https://github.com/joeferraro/MavensMate)

## Install

### Prerequisites

- VS Code [https://code.visualstudio.com/](https://code.visualstudio.com/)
 - OSX: Add VS Code to Path (Run `Shell Command : Install code in PATH` from command palette)
- MavensMate Desktop Beta.6 **(must be running in order for MavensMate for VS Code to function)** [https://github.com/joeferraro/MavensMate-Desktop/releases/tag/v0.0.11-beta.6](https://github.com/joeferraro/MavensMate-Desktop/releases/tag/v0.0.11-beta.6)

### Plugin Installation

1. Open VS Code
2. Run `Extensions: Install Extension` command
	- [Running commands from VS Code](https://code.visualstudio.com/docs/editor/codebasics#_command-palette)
3. Search for `MavensMate`
4. Hit `Enter`

## Setup

### Important Settings (Configured in MavensMate Desktop)

#### Workspaces (mm_workspace)

You may set `mm_workspace` to a single path on your local filesystem or an array of paths.

##### Examples

###### Array of workspaces

```
"mm_workspace" : [
	"/Users/darylshaber/Desktop/my-cool-folder",
	"/Users/darylshaber/Workspaces/my-mavensmate-workspace"
],
```

###### Single workspace

```
"mm_workspace" : "/Users/darylshaber/Desktop/my-cool-folder",
```

**Windows users:** You must use escaped backslashes to set your workspaces:

```
"mm_workspace" : [
	"\\Users\\darylshaber\\Desktop\\my-cool-folder",
	"\\Users\\darylshaber\\Workspaces\\my-mavensmate-workspace"
],
```

## Plugin Development

1. Open the extension project in VS Code
2. Open a Terminal with ```ctrl+` ```
3. Run ```npm install```
4. Develop! [VS Code Extensibility Reference](https://code.visualstudio.com/docs/extensionAPI/overview)

## Organization
The point of entry for the code is src/extension.ts where the extension is registered.
### src
Is the main directory of code for this project.
#### mavensmate
Code specifically relevant to the MavensMate app. Should avoid referencing vscode.
#### vscode
Provides an interface to vscode, encapsulating some concepts relevant to mavensmate.
#### workspace
Encapsulates code relevant to the workspace where projects are contained and the file system.
