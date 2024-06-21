class Interpreter {
    constructor() {
        this.globalScope = new Map();  // Almacena las variables y funciones en el alcance global
        this.output = "";  // Almacena la salida generada por 'mostrame'
        this.returnValue = null;  // Almacena el valor de retorno de las funciones
        this.hasReturn = false;  // Marca si se ha encontrado una declaración de retorno
    }

    // Interpreta el AST y ejecuta el código
    interpret(statements) {
        statements.forEach(statement => this.visit(statement));
    }

    // Visita cada nodo del AST y ejecuta la acción correspondiente
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
                return this.visitFunctionCall(node);
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
                return this.visitBinaryExpression(node);
            case 'Literal':
                return this.visitLiteral(node);
            case 'Identifier':
                return this.visitIdentifier(node);
            default:
                throw new TypeError('Tipo de nodo desconocido: ' + node.type);
        }
    }

    // Ejecuta la declaración de una variable
    visitVarDecl(node) {
        let value = this.visit(node.expr);
        this.globalScope.set(node.name, value);
    }

    // Ejecuta la asignación de una variable
    visitAssignment(node) {
        let value = this.visit(node.expr);
        this.setVariable(node.name, value);
    }

    // Ejecuta la declaración de una función
    visitFunctionDecl(node) {
        this.globalScope.set(node.name, node);
    }

    // Ejecuta la llamada a una función
    visitFunctionCall(node) {
        if (!this.globalScope.has(node.name)) {
            throw new Error(`Función '${node.name}' no declarada`);
        }
        let func = this.globalScope.get(node.name);
        let args = node.args.map(arg => this.visit(arg));
        let localScope = new Map();
        func.params.forEach((param, index) => {
            localScope.set(param, args[index]);
        });
        this.executeBlock(func.body, localScope);
        return this.returnValue;  // Devuelve el valor de retorno de la función
    }

    // Ejecuta una instrucción 'alfajor' (antes 'if')
    visitIfStatement(node) {
        if (this.visit(node.condition)) {
            this.executeBlock(node.thenBranch, this.globalScope);
        } else if (node.elseBranch) {
            this.executeBlock(node.elseBranch, this.globalScope);
        }
    }

    // Ejecuta una instrucción 'while'
    visitWhileStatement(node) {
        while (this.visit(node.condition)) {
            this.executeBlock(node.body, this.globalScope);
        }
    }

    // Ejecuta una instrucción 'for'
    visitForStatement(node) {
        for (this.visit(node.initializer); this.visit(node.condition); this.visit(node.increment)) {
            this.executeBlock(node.body, this.globalScope);
        }
    }

    // Ejecuta una instrucción 'mostrame'
    visitMostrame(node) {
        let value = this.visit(node.expr);
        this.output += value + '\n';
    }

    // Ejecuta una instrucción 'devolveme'
    visitReturn(node) {
        this.returnValue = this.visit(node.expr);  // Almacena el valor de retorno
        this.hasReturn = true;  // Marca que se ha encontrado una declaración de retorno
    }

    // Ejecuta una expresión binaria
    visitBinaryExpression(node) {
        let left = this.visit(node.left);
        let right = this.visit(node.right);
        switch (node.operator) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                return left / right;
            case '<':
                return left < right;
            case '>':
                return left > right;
            case '==':
                return left == right;
            default:
                throw new TypeError('Operador desconocido: ' + node.operator);
        }
    }

    // Retorna el valor de un literal
    visitLiteral(node) {
        return node.value;
    }

    // Retorna el valor de una variable
    visitIdentifier(node) {
        return this.getVariable(node.name);
    }

    // Ejecuta un bloque de declaraciones
    executeBlock(statements, scope) {
        let previousScope = this.globalScope;
        this.globalScope = new Map([...previousScope, ...scope]);
        for (let statement of statements) {
            this.visit(statement);
            if (this.hasReturn) {
                break;
            }
        }
        this.globalScope = previousScope;
    }

    // Obtiene el valor de una variable
    getVariable(name) {
        if (this.globalScope.has(name)) {
            return this.globalScope.get(name);
        }
        throw new Error(`Variable '${name}' no declarada`);
    }

    // Asigna un valor a una variable
    setVariable(name, value) {
        if (this.globalScope.has(name)) {
            this.globalScope.set(name, value);
            return;
        }
        throw new Error(`Variable '${name}' no declarada`);
    }
}
