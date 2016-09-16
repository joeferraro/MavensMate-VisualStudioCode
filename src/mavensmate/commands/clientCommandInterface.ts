export interface ClientCommandInterface {
    id: string;
    async: boolean;
    body?: {
        paths?: string[],
        args?: {
            ui: boolean,
            origin?: string
        }
    }
}