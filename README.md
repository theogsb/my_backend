# Documentação Backend

## 📄 Informações Iniciais

Este documento explica o funcionamento do backend, como realizar requisições e o padrão de resposta de cada uma delas.

## ⚠️ Instruções e Limites de Uso

Por estarmos em processo de desenvolvimento, o servidor roda localmente. Portanto, as requisições funcionarão apenas se o backend estiver rodando na mesma máquina que o frontend.

## 🛠️ Build

Para utilizar o código disponível no GitHub e rodar o servidor, é necessário criar contas no MongoDB e na Gemini API.

### Configuração do Banco de Dados MongoDB

No arquivo de conexão com o banco de dados, insira seu login e senha nos locais indicados para conectar ao banco de dados.

### Configuração da Gemini API

Crie uma conta no site [Google AI](https://ai.google.dev/) e insira sua API KEY no arquivo `./src/routes/textGeneratorRoutes.js`.

### Estrutura de Pastas Necessária

Caso a pasta `uploads` não exista, crie a seguinte estrutura de diretórios:

```
/uploads
  /publicTemplates
  /usersTemplates
```

## 🔒 Autorizações Necessárias

- MongoDB Login
- MongoDB Senha
- Gemini API KEY

## 🛠️ Métodos da API

### 🤖 AI Text Generator

#### POST - Gerar Texto

**Endpoint:**

```
POST http://localhost:3000/generate-text
```

**Body da Requisição:**

```json
{
    "prompt": "Seu texto aqui"
}
```

**Resposta de Sucesso:**

```json
{
    "success": true,
    "message": "Resposta Gerada com Sucesso",
    "text": "Texto gerado pela IA"
}
```

**Resposta de Erro:**

```json
{
    "success": false,
    "message": "Erro interno no servidor.",
    "error": "Mensagem de erro"
}
```

### 🌍 API da Prefeitura

#### POST - Criar Usuário Gov e Cronograma

**Endpoint:**

```
POST http://localhost:3000/apigov
```

**Body da Requisição:**

```json
{
    "email": "apiteste2@rdmapps.com.br",
    "password": "123456"
}
```

**Resposta de Sucesso:**

```json
{
    "success": true,
    "message": "Usuário Criado com sucesso",
    "data": {
        "message": "Login bem-sucedido",
        "user": {
            "name": "api teste2",
            "email": "apiteste2@rdmapps.com.br"
        }
    }
}
```

**Resposta de Erro:**

```json
{
    "success": false,
    "message": "Erro ao criar usuário!",
    "error": "Mensagem de erro"
}
```

### 🗓 Cronograma

#### GET - Receber Cronograma

**Endpoint:**

```
GET http://localhost:3000/schedule/:userId
```

**Resposta de Sucesso:**

```json
{
    "success": true,
    "message": "Cronograma Enviado com sucesso!",
    "data": { "userId": "21", "posts": [] }
}
```

**Resposta de Erro:**

```json
{
    "success": false,
    "message": "Erro interno no servidor",
    "error": "Cronograma não encontrado!"
}
```

#### GET - Receber Postagem

**Endpoint:**

```
GET http://localhost:3000/schedule/:userId/posts/:postsId
```

**Resposta de Sucesso:**

```json
{
    "success": true,
    "message": "Postagem Enviada com sucesso!",
    "data": {
      "platform": "Plataforma para a postagem",
      "postText": "Texto para a imagem",
      "postDate": "dd-mm-aa",
      "postTime": "HH:mm",
      "imagePath": {arquivo JPEG ou PNG}
      }
}
```

**Resposta de Erro:**

```json
{
    "success": false,
    "message": "Erro interno no servidor",
    "error": "Postagem não encontrada!"
}
```

#### POST - Criar Postagem

**Endpoint:**

```
POST http://localhost:3000/schedule/:userId/posts
```

**Body da Requisição:**

```json
{
    "platform": "Plataforma para a postagem",
    "postText": "Texto para a imagem",
    "postDate": "dd-mm-aa",
    "postTime": "HH:mm",
    "imagePath": {arquivo JPEG ou PNG}
}
```

**Resposta de Sucesso:**

```json
{
    "success": true,
    "message": "Postagem criada com sucesso!",
    "data": {
        "userId": "21",
        "posts": []
    }
}
```

**Resposta de Erro:**

```json
{
    "success": false,
    "message": "Erro interno no servidor",
    "error": "Mensagem de erro!"
}
```

#### PATCH - Atualizar Postagem

**Endpoint:**

```
PATCH http://localhost:3000/schedule/:userId/posts/:postId
```
**Body da Requisição:**

```json
{
    "platform": "Plataforma para a postagem",
    "postText": "Texto para a imagem",
    "postDate": "dd-mm-aa",
    "postTime": "HH:mm",
    "imagePath": {arquivo JPEG ou PNG}
}
```

**Resposta de Sucesso:**

```json
{
    "success": true,
    "message": "Postagem Atualizada com sucesso!",
    "data": {
        "userId": "21",
        "posts": []
    }
}
```

**Resposta de Erro:**

```json
{
    "success": false,
    "message": "Erro interno no servidor",
    "error": "Mensagem de erro!"
}
```

#### DELETE - Deletar Postagem

**Endpoint:**

```
DELETE http://localhost:3000/schedule/:userId/posts/:postId
```

**Resposta de Sucesso:**

```json
{
    "success": true,
    "message": "Postagem Excluída com sucesso!",
    "data": {
        "id": "67cf84eee812a47e4f0812c8",
        "userId": "21",
        "posts": []
    }
}
```

**Resposta de Erro:**

```json
{
    "success": false,
    "message": "Erro interno no servidor",
    "error": "Mensagem de erro!"
}
```

### 📝 Templates

#### GET - Receber Lista de Templates

**Endpoint:**

```
GET http://localhost:3000/template/
```

**Resposta de Sucesso:**

```json
{
    "success": true,
    "message": "Templates Enviados com sucesso!",
    "data": [
      {
        "_id" : "67cf9c467215a8e65b9e8922",
        "imagePath" : ""
      }
    ]
}
```

**Resposta de Erro:**

```json
{
    "success": false,
    "message": "Erro interno no servidor",
    "error": "Mensagem de Erro!"
}
```


#### POST - Criar Template

**Endpoint:**

```
POST http://localhost:3000/template/
```

**Body da Requisição:**

```json
{
    "imagePath": {arquivo JPEG ou PNG}
}
```

**Resposta de Sucesso:**

```json
{
    "success": true,
    "message": "Template criado com sucesso!",
    "data": [
      {
        "imagePath" : ""
        "_id" : "67cf9c467215a8e65b9e8922",
      }
    ]
}
```

**Resposta de Erro:**

```json
{
    "success": false,
    "message": "Erro interno no servidor",
    "error": "Mensagem de erro"
}
```

#### PATCH - Atualizar Template

**Endpoint:**

```
PATCH http://localhost:3000/template/:id
```

**Body da Requisição:**

```json
{
    "imagePath": {arquivo JPEG ou PNG}
}
```

**Resposta de Sucesso:**

```json
{
    "success": true,
    "message": "Template atualizado com sucesso!",
    "data": [
      {
        "_id" : "67cf9c467215a8e65b9e8922",
        "imagePath" : ""
      }
    ]
}
```

**Resposta de Erro:**

```json
{
    "success": false,
    "message": "Erro interno no servidor",
    "error": "Mensagem de erro"
}
```

#### DELETE - Deletar Template

**Endpoint:**

```
DELETE http://localhost:3000/template/:id
```

**Resposta de Sucesso:**

```json
{
    "success": true,
    "message": "Template excluído com sucesso!",
    "data": [
      {
        "_id" : "67cf9c467215a8e65b9e8922",
        "imagePath" : ""
      }
    ]
}
```

**Resposta de Erro:**

```json
{
    "success": false,
    "message": "Erro interno no servidor",
    "error": "Mensagem de erro"
}
```

---

👤 **Autores**: Marcos Antonio , Theo Gusmão 👥 **Contato**: [maqvn@cin.ufpe.br] , [tgsb@cin.ufpe.br]

