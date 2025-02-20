const path = require ("path")

// Nome do arquivo atual
console.log(path.basename(__filename));

// Nome do Diretório atual
console.log(path.dirname(__filename));

// Extensão do arquivo
console.log(path.extname(__filename));

// criar objeto path
console.log(path.parse(__filename));

// Juntar caminhos de arquivos
console.log(path.join(__dirname))
