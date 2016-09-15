interface Command {
    command: string,
    name: string,
    async: boolean,
    currentTextDocument?: boolean,
    body?: {
        paths?: string[]
        args?: {
            ui: boolean,
            origin?: string
        }
    },
    confirm?: {
        message: string
    }
}

export default Command;