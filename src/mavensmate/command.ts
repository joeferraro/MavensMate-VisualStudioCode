interface Command {
    command: string,
    async: boolean,
    currentTextDocument?: boolean,
    body?: {
        paths?: string[]
        args?: {
            ui: boolean
        }
    }
}

export default Command;