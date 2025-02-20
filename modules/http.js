// importando o método padrão do NODE (http)
const http = require('http');

// porta do servidor
const port = 8080.

// criando o servidor
const server = http.createServer((request, response) => {
    
    // se a request for x a response será y...
    
    if (request.url == '/home') {
        response.writeHead(200, {'content-type': 'text.html'});
        response.end('<h1>Response<h1>');
    }

    if (request.url == '/users') {
        const users = [
            {
                name: 'ton',
                email: 'tontongostosao@gmail.com'
            },
            {
                name: 'lucy',
                email: 'lucysapeca@gmail.com'
            },
        ];
        response.writeHead(200, {'content-type': 'application/json'});
        response.end(JSON.stringify(users));
        
    }
})

server.listen(port, () => console.log(`Rodando na porta ${port}!`));