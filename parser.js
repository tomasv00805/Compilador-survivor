class Parser {
    constructor(tokens) {
        this.tokens = tokens;  // Lista de tokens a analizar
        this.current = 0;  // Índice actual de análisis
    }

    // Convierte la lista de tokens en un árbol de sintaxis abstracta (AST)
    parse() {
        let statements = [];
        while (this.current < this.tokens.length) {
            statements.push(this.parseStatement());
        }
        return statements;
    }

    // Analiza una declaración en el código
    parseStatement() {
        let token = this.tokens[this.current];

        if (token.type === 'KEYWORD') {
            switch (token.value) {
                case 'caramelo':
                    return this.parseVarDecl();
                case 'alfajor':
                    return this.parseIfStatement();
                case 'gomita':
                    return this.parseWhileStatement();
                case 'batido':
                    return this.parseForStatement();
                case 'torta':
                    return this.parseFunctionDecl();
                case 'mostrame':
                    return this.parseMostrame();
                case 'devolveme':
                    return this.parseReturn();
                default:
                    throw new TypeError('Declaración desconocida: ' + token.value);
            }
        }

        if (token.type === 'IDENTIFIER') {
            return this.parseAssignmentOrFunctionCall();
        }

        throw new TypeError('Declaración desconocida: ' + token.value);
    }

    // Analiza una instrucción 'mostrame'
    parseMostrame() {
        this.consume('KEYWORD', 'mostrame');  // Consume la palabra clave 'mostrame'
        this.consume('LPAREN');  // Consume el paréntesis de apertura '('
        let expr = this.parseExpression();  // Analiza la expresión dentro de los paréntesis
        this.consume('RPAREN');  // Consume el paréntesis de cierre ')'
        this.consume('SEMICOLON');  // Consume el punto y coma ';'
        return { type: 'Mostrame', expr };  // Devuelve un nodo 'Mostrame' en el AST
    }

    // Analiza una declaración de variable
    parseVarDecl() {
        this.consume('KEYWORD', 'caramelo');  // Consume la palabra clave 'caramelo'
        let name = this.consume('IDENTIFIER').value;  // Consume el identificador de la variable
        if (this.peek().type === 'EQUALS') {
            this.consume('EQUALS');  // Consume el operador de asignación '='
            let expr = this.parseExpression();  // Analiza la expresión de asignación
            this.consume('SEMICOLON');  // Consume el punto y coma ';'
            return { type: 'VarDecl', name, expr };  // Devuelve un nodo 'VarDecl' en el AST
        } else {
            this.consume('SEMICOLON');  // Consume el punto y coma ';'
            return { type: 'VarDecl', name, expr: { type: 'Literal', value: null } };  // Devuelve un nodo 'VarDecl' en el AST
        }
    }

    // Analiza una instrucción 'alfajor' (antes 'if')
    parseIfStatement() {
        this.consume('KEYWORD', 'alfajor');  // Consume la palabra clave 'alfajor'
        this.consume('LPAREN');  // Consume el paréntesis de apertura '('
        let condition = this.parseExpression();  // Analiza la condición del 'alfajor'
        this.consume('RPAREN');  // Consume el paréntesis de cierre ')'
        this.consume('LBRACE');  // Consume la llave de apertura '{'
        let thenBranch = [];  // Nodo para las declaraciones del bloque 'then'
        while (this.peek().type !== 'RBRACE') {
            thenBranch.push(this.parseStatement());
        }
        this.consume('RBRACE');  // Consume la llave de cierre '}'
        let elseBranch = [];
        if (this.peek().type === 'KEYWORD' && this.peek().value === 'chocolate') {
            this.consume('KEYWORD', 'chocolate');
            this.consume('LBRACE');
            while (this.peek().type !== 'RBRACE') {
                elseBranch.push(this.parseStatement());
            }
            this.consume('RBRACE');
        }
        return { type: 'IfStatement', condition, thenBranch, elseBranch };  // Devuelve un nodo 'IfStatement' en el AST
    }

    // Analiza una instrucción 'gomita' (antes 'while')
    parseWhileStatement() {
        this.consume('KEYWORD', 'gomita');  // Consume la palabra clave 'gomita'
        this.consume('LPAREN');  // Consume el paréntesis de apertura '('
        let condition = this.parseBinaryExpression();  // Analiza la condición del 'gomita'
        this.consume('RPAREN');  // Consume el paréntesis de cierre ')'
        this.consume('LBRACE');  // Consume la llave de apertura '{'
        let body = [];  // Nodo para las declaraciones del cuerpo del 'gomita'
        while (this.peek().type !== 'RBRACE') {
            body.push(this.parseStatement());
        }
        this.consume('RBRACE');  // Consume la llave de cierre '}'
        return { type: 'WhileStatement', condition, body };  // Devuelve un nodo 'WhileStatement' en el AST
    }

    // Analiza una instrucción 'batido' (antes 'for')
    parseForStatement() {
        this.consume('KEYWORD', 'batido');  // Consume la palabra clave 'batido'
        this.consume('LPAREN');  // Consume el paréntesis de apertura '('
        let initializer = this.parseVarDecl();  // Analiza la declaración de inicialización
        let condition = this.parseExpression();  // Analiza la condición del 'batido'
        this.consume('SEMICOLON');  // Consume el punto y coma ';'
        let increment = this.parseAssignment();  // Analiza la instrucción de incremento
        this.consume('RPAREN');  // Consume el paréntesis de cierre ')'
        this.consume('LBRACE');  // Consume la llave de apertura '{'
        let body = [];  // Nodo para las declaraciones del cuerpo del 'batido'
        while (this.peek().type !== 'RBRACE') {
            body.push(this.parseStatement());
        }
        this.consume('RBRACE');  // Consume la llave de cierre '}'
        return { type: 'ForStatement', initializer, condition, increment, body };  // Devuelve un nodo 'ForStatement' en el AST
    }

    // Analiza una declaración de función 'torta' (antes 'function')
    parseFunctionDecl() {
        this.consume('KEYWORD', 'torta');  // Consume la palabra clave 'torta'
        let name = this.consume('IDENTIFIER').value;  // Consume el identificador de la función
        this.consume('LPAREN');  // Consume el paréntesis de apertura '('
        let params = [];  // Lista de parámetros de la función
        if (this.peek().type !== 'RPAREN') {
            params.push(this.consume('IDENTIFIER').value);  // Consume el primer parámetro
            while (this.peek().type === 'COMMA') {
                this.consume('COMMA');  // Consume la coma ','
                params.push(this.consume('IDENTIFIER').value);  // Consume el siguiente parámetro
            }
        }
        this.consume('RPAREN');  // Consume el paréntesis de cierre ')'
        this.consume('LBRACE');  // Consume la llave de apertura '{'
        let body = [];  // Nodo para las declaraciones del cuerpo de la función
        while (this.peek().type !== 'RBRACE') {
            body.push(this.parseStatement());
        }
        this.consume('RBRACE');  // Consume la llave de cierre '}'
        return { type: 'FunctionDecl', name, params, body };  // Devuelve un nodo 'FunctionDecl' en el AST
    }

    // Analiza una asignación o llamada a función
    parseAssignmentOrFunctionCall() {
        let name = this.consume('IDENTIFIER').value;  // Consume el identificador
        if (this.peek().type === 'EQUALS') {
            this.consume('EQUALS');  // Consume el operador de asignación '='
            let expr = this.parseExpression();  // Analiza la expresión de asignación
            this.consume('SEMICOLON');  // Consume el punto y coma ';'
            return { type: 'Assignment', name, expr };  // Devuelve un nodo 'Assignment' en el AST
        } else if (this.peek().type === 'LPAREN') {
            this.consume('LPAREN');  // Consume el paréntesis de apertura '('
            let args = [];  // Lista de argumentos de la función
            if (this.peek().type !== 'RPAREN') {
                args.push(this.parseExpression());  // Analiza el primer argumento
                while (this.peek().type === 'COMMA') {
                    this.consume('COMMA');  // Consume la coma ','
                    args.push(this.parseExpression());  // Analiza el siguiente argumento
                }
            }
            this.consume('RPAREN');  // Consume el paréntesis de cierre ')'
            this.consume('SEMICOLON');  // Consume el punto y coma ';'
            return { type: 'FunctionCall', name, args };  // Devuelve un nodo 'FunctionCall' en el AST
        } else {
            throw new TypeError('Expresión desconocida: ' + name);
        }
    }

    // Analiza una asignación
    parseAssignment() {
        let name = this.consume('IDENTIFIER').value;  // Consume el identificador
        this.consume('EQUALS');  // Consume el operador de asignación '='
        let expr = this.parseExpression();  // Analiza la expresión de asignación
        this.consume('SEMICOLON');  // Consume el punto y coma ';'
        return { type: 'Assignment', name, expr };  // Devuelve un nodo 'Assignment' en el AST
    }

    // Analiza una instrucción 'devolveme'
    parseReturn() {
        this.consume('KEYWORD', 'devolveme');  // Consume la palabra clave 'devolveme'
        let expr = this.parseExpression();  // Analiza la expresión de retorno
        this.consume('SEMICOLON');  // Consume el punto y coma ';'
        return { type: 'ReturnStatement', expr };  // Devuelve un nodo 'ReturnStatement' en el AST
    }

    // Analiza una expresión
    parseExpression() {
        return this.parseBinaryExpression();  // Analiza una expresión binaria
    }

    // Analiza una expresión binaria
    parseBinaryExpression() {
        let left = this.parsePrimaryExpression();  // Analiza la expresión primaria izquierda
        while (this.peek().type === 'OPERATOR') {
            let operator = this.consume('OPERATOR').value;  // Consume el operador
            let right = this.parsePrimaryExpression();  // Analiza la expresión primaria derecha
            left = { type: 'BinaryExpression', operator, left, right };  // Crea un nodo 'BinaryExpression' en el AST
        }
        return left;  // Devuelve la expresión binaria completa
    }

    // Analiza una expresión primaria
    parsePrimaryExpression() {
        let token = this.consume();  // Consume el token actual
        if (token.type === 'NUMBER') {
            return { type: 'Literal', value: Number(token.value) };  // Devuelve un nodo 'Literal' en el AST
        } else if (token.type === 'STRING') {
            return { type: 'Literal', value: token.value };  // Devuelve un nodo 'Literal' en el AST
        } else if (token.type === 'IDENTIFIER') {
            return { type: 'Identifier', name: token.value };  // Devuelve un nodo 'Identifier' en el AST
        } else if (token.type === 'LPAREN') {
            let expr = this.parseExpression();  // Analiza la expresión dentro del paréntesis
            this.consume('RPAREN');  // Consume el paréntesis de cierre ')'
            return expr;  // Devuelve la expresión
        } else {
            throw new TypeError('Expresión primaria desconocida: ' + token.value);
        }
    }

    // Consume el token actual si coincide con el tipo y valor dados, y avanza al siguiente token
    consume(type, value) {
        let token = this.tokens[this.current];  // Obtiene el token actual
        if (type && token.type !== type) {
            throw new TypeError(`Se esperaba el tipo de token ${type}, pero se encontró ${token.type}`);
        }
        if (value && token.value !== value) {
            throw new TypeError(`Se esperaba el valor del token ${value}, pero se encontró ${token.value}`);
        }
        this.current++;  // Avanza al siguiente token
        return token;  // Devuelve el token consumido
    }

    // Devuelve el token actual sin avanzar
    peek() {
        return this.tokens[this.current];  // Devuelve el token actual
    }
}
