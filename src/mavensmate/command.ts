interface Command {
    command: string,
    name: string,
    async: boolean,
    currentTextDocument?: boolean,
    body?: {
        paths?: string[]
        args?: {
            ui: boolean
        }
    },
    confirm?: {
        message: string
    }
}

export default Command;