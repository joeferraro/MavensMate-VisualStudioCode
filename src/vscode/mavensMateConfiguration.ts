import { workspace } from 'vscode';

export function getConfiguration<T>(key: string): T{
    return workspace.getConfiguration().get<T>(key);
}