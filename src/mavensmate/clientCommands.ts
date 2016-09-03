import Command from './command';

export function list(): { [id: string]: Command } {
    return  {
        'mavensmate.openUI': {
            command: 'open-ui',
            async: false,
            body: {
                args: {
                    ui: true
                }
            }
        },
        'mavensmate.openGlobalSettings': {
            command: 'open-settings',
            async: false,
            body: {
                args: {
                    ui: true
                }
            }
        },
        'mavensmate.newProject': {
            command: 'new-project',
            async: false,
            body: {
                args: {
                    ui: true
                }
            }
        },
        'mavensmate.oAuthProject': {
            command: 'oauth-project',
            async: false,
            body: {
                args: {
                    ui: true
                }
            }
        },
        'mavensmate.compileCurrentFile': {
            command: 'compile-metadata',
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
            async: true,
            body: {
                args: {
                    ui: false
                }
            }
        },
        'mavensmate.compileProject': {
            command: 'compile-project',
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
            async: true,
            body: {
                args: {
                    ui: false
                }
            }
        }
    };
}