class SemanticAnalyzer {
    constructor() {
        // Tabla de símbolos para almacenar variables y funciones
        this.symbolTable = new Map();  
    }

    // Analiza el AST en busca de errores semánticos
    analyze(statements) {
        statements.forEach(statement => this.visit(statement));
    }

    // Visita cada nodo del AST y realiza comprobaciones semánticas
    visit(node) {
        switch (node.type) {
            case 'VarDecl':
                this.visitVarDecl(node);
                break;
            case 'Assignment':
                this.visitAssignment(node);
                break;
            case 'FunctionDecl':
                this.visitFunctionDecl(node);
                break;
            case 'FunctionCall':
                this.visitFunctionCall(node);
                break;
            case 'IfStatement':
                this.visitIfStatement(node);
                break;
            case 'WhileStatement':
                this.visitWhileStatement(node);
                break;
            case 'ForStatement':
                this.visitForStatement(node);
                break;
            case 'Mostrame':
                this.visitMostrame(node);
                break;
            case 'ReturnStatement':
                this.visitReturn(node);
                break;
            case 'BinaryExpression':
                this.visitBinaryExpression(node);
                break;
            case 'Literal':
            case 'Identifier':
                break;
            default:
                throw new TypeError('Tipo de nodo desconocido: ' + node.type);
        }
    }

    // Verifica la declaración de una variable
    visitVarDecl(node) {
        if (this.symbolTable.has(node.name)) {
            throw new Error(`Variable '${node.name}' ya declarada`);
        }
        this.symbolTable.set(node.name, null);
    }

    // Verifica la asignación de una variable
    visitAssignment(node) {
        if (!this.symbolTable.has(node.name)) {
            throw new Error(`Variable '${node.name}' no declarada`);
        }
    }

    // Verifica la declaración de una función
    visitFunctionDecl(node) {
        if (this.symbolTable.has(node.name)) {
            throw new Error(`Función '${node.name}' ya declarada`);
        }
        this.symbolTable.set(node.name, {
            type: 'function',
            params: node.params
        });
    }

    // Verifica la llamada a una función
    visitFunctionCall(node) {
        if (!this.symbolTable.has(node.name) || this.symbolTable.get(node.name).type !== 'function') {
            throw new Error(`Función '${node.name}' no declarada`);
        }
    }

    // Verifica una instrucción 'if'
    visitIfStatement(node) {
        this.visit(node.condition);
        node.thenBranch.forEach(stmt => this.visit(stmt));
        node.elseBranch.forEach(stmt => this.visit(stmt));
    }

    // Verifica una instrucción 'while'
    visitWhileStatement(node) {
        this.visit(node.condition);
        node.body.forEach(stmt => this.visit(stmt));
    }

    // Verifica una instrucción 'for'
    visitForStatement(node) {
        this.visit(node.initializer);
        this.visit(node.condition);
        this.visit(node.increment);
        node.body.forEach(stmt => this.visit(stmt));
    }

    // Verifica una instrucción 'mostrame'
    visitMostrame(node) {
        this.visit(node.expr);
    }

    // Verifica una instrucción 'devolveme'
    visitReturn(node) {
        this.visit(node.expr);
    }

    // Verifica una expresión binaria
    visitBinaryExpression(node) {
        this.visit(node.left);
        this.visit(node.right);
    }

    // Verifica si una declaración de variable tiene punto y coma al final
    checkSemicolon(node) {
        if (this.current < this.tokens.length && this.tokens[this.current].type !== 'SEMICOLON') {
            throw new Error('Falta punto y coma al final de la declaración');
        }
    }
}
