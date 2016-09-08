import Command from './command';

export function list(): { [id: string]: Command } {
    return  {
        'mavensmate.openUI': {
            command: 'open-ui',
            name: 'Open UI',
            async: false,
            body: {
                args: {
                    ui: true
                }
            }
        },
        'mavensmate.openGlobalSettings': {
            command: 'open-settings',
            name: 'Open Settings',
            async: false,
            body: {
                args: {
                    ui: true
                }
            }
        },
        'mavensmate.newProject': {
            command: 'new-project',
            name: 'New Project',
            async: false,
            body: {
                args: {
                    ui: true
                }
            }
        },
        'mavensmate.oAuthProject': {
            command: 'oauth-project',
            name: 'oAuth Project',
            async: false,
            body: {
                args: {
                    ui: true
                }
            }
        },
        'mavensmate.compileCurrentFile': {
            command: 'compile-metadata',
            name: 'Compile Metadata',
            async: true,
            currentTextDocument: true,
            body: {
                args: {
                    ui: false
                }
            }
        },
        'mavensmate.compileFile': {
            command: 'compile-metadata',
            name: 'Compile File',
            async: true,
            body: {
                args: {
                    ui: false
                }
            }
        },
        'mavensmate.compileProject': {
            command: 'compile-project',
            name: 'Compile Project',
            async: true,
            body: {
                args: {
                    ui: false
                }
            },
            confirm: {
                message: 'Would you like to compile the project?'
            }
        },
        'mavensmate.refreshCurrentFile': {
            command: 'refresh-metadata',
            name: 'Refresh Metadata',
            async: true,
            currentTextDocument: true,
            body: {
                args: {
                    ui: false
                }
            }
        },
        'mavensmate.refreshFile': {
            command: 'refresh-metadata',
            name: 'Refresh Metadata',
            async: true,
            body: {
                args: {
                    ui: false
                }
            }
        }
    };
}