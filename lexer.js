class Lexer {
    constructor(input) {
        this.input = input;  // Entrada de texto para analizar
        this.tokens = [];  // Lista de tokens generados
        this.current = 0;  // Índice actual de análisis
        this.keywords = ['caramelo', 'alfajor', 'chocolate', 'gomita', 'batido', 'torta', 'mostrame', 'devolveme'];  // Palabras clave del lenguaje
        this.tokenize();  // Iniciar el proceso de tokenización
    }

    // Convierte la entrada de texto en una lista de tokens
    tokenize() {
        while (this.current < this.input.length) {
            let char = this.input[this.current];

            // Ignorar espacios en blanco
            if (/\s/.test(char)) {
                this.current++;
                continue;
            }

            // Identificar palabras clave y nombres de variables
            if (/[a-zA-Z_]/.test(char)) {
                let value = '';
                while (/[a-zA-Z0-9_]/.test(char)) {
                    value += char;
                    char = this.input[++this.current];
                }
                if (this.keywords.includes(value)) {
                    this.tokens.push({ type: 'KEYWORD', value });
                } else {
                    this.tokens.push({ type: 'IDENTIFIER', value });
                }
                continue;
            }

            // Identificar números
            if (/[0-9]/.test(char)) {
                let value = '';
                while (/[0-9]/.test(char)) {
                    value += char;
                    char = this.input[++this.current];
                }
                this.tokens.push({ type: 'NUMBER', value });
                continue;
            }

            // Identificar strings
            if (char === '"') {
                char = this.input[++this.current];
                let value = '';
                while (char !== '"') {
                    value += char;
                    char = this.input[++this.current];
                }
                this.tokens.push({ type: 'STRING', value });
                this.current++;
                continue;
            }

            // Identificar operadores y signos de puntuación
            if (char === '=' && this.input[this.current + 1] === '=') {
                this.tokens.push({ type: 'OPERATOR', value: '==' });
                this.current += 2;
                continue;
            }

            if (char === '=') {
                this.tokens.push({ type: 'EQUALS', value: '=' });
                this.current++;
                continue;
            }

            if (char === ';') {
                this.tokens.push({ type: 'SEMICOLON', value: ';' });
                this.current++;
                continue;
            }

            if (char === '(') {
                this.tokens.push({ type: 'LPAREN', value: '(' });
                this.current++;
                continue;
            }

            if (char === ')') {
                this.tokens.push({ type: 'RPAREN', value: ')' });
                this.current++;
                continue;
            }

            if (char === '{') {
                this.tokens.push({ type: 'LBRACE', value: '{' });
                this.current++;
                continue;
            }

            if (char === '}') {
                this.tokens.push({ type: 'RBRACE', value: '}' });
                this.current++;
                continue;
            }

            if (char === ',') {
                this.tokens.push({ type: 'COMMA', value: ',' });
                this.current++;
                continue;
            }

            if ('+-*/<>'.includes(char)) {
                this.tokens.push({ type: 'OPERATOR', value: char });
                this.current++;
                continue;
            }

            // Si se encuentra un carácter desconocido, lanzar un error
            throw new TypeError('Carácter desconocido: ' + char);
        }
    }
}
