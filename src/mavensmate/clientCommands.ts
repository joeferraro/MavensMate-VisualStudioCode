export function list(){
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
        }
    };
}