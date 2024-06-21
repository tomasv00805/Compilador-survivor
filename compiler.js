document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('compile').addEventListener('click', function () {
        const code = document.getElementById('code').value;
        compileCode(code);
    });
});

function compileCode(code) {
    try {
        // Analiza el código y genera tokens
        const lexer = new Lexer(code);  
        // Convierte los tokens en un AST
        const parser = new Parser(lexer.tokens);  
        // Obtiene el AST
        const ast = parser.parse();  
        // Crea el analizador semántico
        const semanticAnalyzer = new SemanticAnalyzer();  
        // Analiza el AST en busca de errores semánticos
        semanticAnalyzer.analyze(ast);  
        // Crea el intérprete
        const interpreter = new Interpreter();  
        // Ejecuta el AST
        interpreter.interpret(ast);  
        // Muestra la salida y el AST
        document.getElementById('output').textContent = 'Compilación y Ejecución Exitosa!\n' + interpreter.output + '\n' + JSON.stringify(ast, null, 2);  
    } catch (error) {
        // Muestra errores
        document.getElementById('output').textContent = 'Error: ' + error.message;  
    }
}
