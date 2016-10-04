import { ClientCommand } from './clientCommand';
import { BaseCommand } from './baseCommand';

module.exports = class IndexMetadata extends ClientCommand {
    static create(): BaseCommand {
        return new IndexMetadata();
    }

    constructor() {
        super('Index Metadata', 'index-metadata');
    }
}