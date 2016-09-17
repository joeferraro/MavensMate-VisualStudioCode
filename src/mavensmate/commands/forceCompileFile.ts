import CompileFile = require('./compileFile');

module.exports = class ForceCompileFile extends CompileFile {
    static create(){
        return new ForceCompileFile();
    }

    constructor(){
        super('Force Compile File');

        this.body.force = true;
    }
}