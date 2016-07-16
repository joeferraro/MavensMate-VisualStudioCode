interface Command {
    command: string,
    async: boolean,
    paths?: string,
    body?: {
        paths?: string[]
        args: {
            ui: boolean
        }
    }
}

export default Command;