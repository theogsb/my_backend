const fs = require("fs")
const path = require("path")

// criar pasta
fs.mkdir(path.join(__dirname, "/teste"), (error) => {
    if (error) {
        return console.log("Erro: ", (error));
    }
    console.log("Pasta criada com sucesso");
});


// criar um arquivo
fs.writeFile(
    path.join(__dirname, "teste", "teste.txt"), "hello Node! ", (error) => {
    
        if (error) {
        return console.log("Erro: ", error);
    }
    console.log("Arquivo criado");
    
    // adicionar texto a um arquivo
    fs.appendFile(
        path.join(__dirname, "teste", "teste.txt"), "Hello World!", (error) => {
        
            if (error) {
            return console.log("Erro: ", (error));
        }
        console.log("Texto adicionado com sucesso");
     }
    );

    // ler arquivo
    fs.readFile(path.join(__dirname, "teste", "teste.txt"), "utf8", (error, data) => {
        if (error) {
            return console.log("Erro: ", error);
        }
        console.log(data);
     }
    );

    }
);

