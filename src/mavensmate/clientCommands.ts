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
        'mavensmate.compileFile': {
            command: 'compile-metadata',
            async: true,
            currentTextDocument: true,
            body: {
                args: {
                    ui: true
                }
            }
        }
    };
}