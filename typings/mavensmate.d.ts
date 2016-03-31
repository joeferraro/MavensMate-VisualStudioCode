/// <reference path="./node.d.ts" />
declare var mavensmate: mavensmate.MavensMateStatic;

declare module "mavensmate" {
    export = mavensmate;
}

declare module mavensmate {
    
    interface MavensMateStatic {
        
        createClient(options: ClientOptions): Client;
        
    }
    
    interface Client extends NodeJS.EventEmitter {
        
        ClientOptions;
        server: UIServer;
        
        new(options: ClientOptions): Client;
        
        /**
         * Calls JSON.stringify on the clients options.
         * Example response: "{ name: 'Client Name', isServer: true, isNodeApp: false, isCommandLine: false, settings: {} }"
         */
        toString(): string;
        
        /**
         * Returns true if client is interacting via the command line
         */
        isCommandLine(): boolean;
        
        /**
         * Starts the local express.js UI server
         */
        startUIServer(): void;
        
        /**
         * Returns an instance of the clients ui server
         */
        getServer(): UIServer;
        
        /**
         * Destroys the client by stopping the server
         */
        destroy(): void;
        
        /**
         * Returns the project associated with the client (currently a 1:1 relationship as per the Atom project model)
         * @returns Project
         */
        getProjects(): Project;
        
        /**
         * Gets a project by it's ID
         * @returns Project
         */
        getProject(id: string): Project;
        
        /**
         * Adds a MavensMate project to the client
         * @returns Promise<Project>
         */
        addProject(projectPath: string, sfdcClient: SFDCClient): Promise<Project>;
        
        /**
         * Adds a project to the MavensMate client by Id
         * @returns Promise<Project>
         */
        addProjectById(projectId: string, sfdcClient: SFDCClient): Promise<Project>;
        
        /**
         * Reinits the config. Useful after a config file changes.
         */
        reloadConfig(): void;
        
        /**
         * Executes a named command
         * @param {Project | string} projectOrProjectId The project or id of the project to run on
         * @param {String} command Name of the command, e.g. new-project
         * @param {Object} options context : { args: { ui: true }, payload: { username: foo, password: bar } }
         * @param {EditorService} editor TODO: Figure this out
         */
        executeCommandForProject(projectOrProjectId: Project | string, command: string, payload: CommandPayload, editor): void;
        
        
    }
    
    interface CommandPayload {
        args: {
            ui: boolean;
        };
        payload: {
            username: string;
            password: string;
        }
    }
    
    interface ClientOptions {
        name: string;
        verbose: boolean;
        program: any;
        settings: {[key: string]: any};
        isNodeApp: boolean;
        isServer: boolean;
        windowOpener: any;
    }
    
    interface UIServer {
        
    }
    
    interface Project extends NodeJS.EventEmitter {
        opts: {
            name: string;
            subscription: string;
            workspace: string;
            path: string;
            packages: string[];
        };
        keychainService: KeychainService;
    }
    
    interface SFDCClient {
        
    }
    
    interface KeychainService {
        
    }
    
    interface EditorService {
        
    }
    
}
