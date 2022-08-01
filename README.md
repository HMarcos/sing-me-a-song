# <p align = "center"> Sing me a Song </p>

<p align="center">
   <img style="width:300px;height:300px" src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f399-fe0f.svg"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-HMarcos-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/HMarcos/sing-me-a-song?color=4dae71&style=flat-square" />
</p>


##  :clipboard: Descrição

Sing me a song é uma aplicação para recomendação anônima de músicas. Quanto mais as pessoas curtirem uma recomendação, maior a chance dela ser recomendada para outras pessoas 🙂.

***

## :computer: Tecnologias e Conceitos

- REST APIs
- Node.js
- TypeScript
- Prisma ORM
- Postgres SQL
- Jest
- SuperTest
- React
- Cypress

O objetivo desse repositório é implementar os testes ponta a ponta (**E2E**), de integração e unitários (com 100% de coverage para os services da aplicação). 
***

## :rocket: Rotas


### Recomendações

```yml
POST /recommendations
    - Rota para adicionar uma recomendação de uma música
    - headers: {}
    - body: {
        "name": "Falamansa - Xote dos Milagres",
        "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    }
```

```yml
GET /recommendations
    - Rota que retorna as 10 últimas recomendações adicionadas
    - headers: { }
    - body: {}
```

```yml 
POST /recommendations/:id/upvote
    - Rota que incrementa o score de uma recomendação em 1 ponto.
    - headers: {}
    - body: {}
```

```yml 
POST /recommendations/:id/downvote
    - Rota que decrementa o score de uma recomendação em 1 ponto.
    - Caso o score da recomendação seja menor que -5, ela é excluída.
    - headers: {}
    - body: {}
```

```yml
GET /recommendations/:id
    - Rota que retorna a recomendação com o id especificado.
    - headers: { }
    - body: {}
```

```yml
GET /recommendations/random
    - Rota que retorna uma recomendação aleatória.
    - headers: { }
    - body: {}
```


```yml
GET /recommendations/top/:amount
    - Rota que retorna as músicas com maiores scores.
    - O parâmetro :amount indica a quantidade de músicas solicitadas.
    - headers: { }
    - body: {}
```
    
***

## 🏁 Rodando a aplicação

### Backend

Este projeto foi desenvolvido utilizando **TypeScript**, então certifique-se que você tem a ultima versão estável do [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/) rodando localmente.

Primeiro, clone o repositório na sua maquina:

```
git clone https://github.com/HMarcos/sing-me-a-song
```

Em seguida mude para a pasta `backend`:

```
cd back-end
```

Depois, dentro da pasta, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Em seguida, com o arquivo **.env** configurado, rode o seguinte comando para configurar o **Prisma** e a base de dados.

```
npx prisma migrate dev
```

Finalizado o processo, é só inicializar o servidor

```
npm run dev
```

Caso queira rodar a aplicação em modo de teste, execute o seguinte comando:

```
npm run dev:test
```


#### Testes de Integração

Para rodar os testes de integração configure o arquivo `.env.test` com o banco de dados de teste, após isso rode o comando:

```
npm run test:integration
```

#### Testes Unitários

Para rodar os testes unitários configure o arquivo `.env.test` com a variável de ambiente `NODE_ENV=test`, após isso rode o comando:

```
npm run test:unit
```

### Frontend

Este projeto foi desenvolvido utilizando **React**, então certifique-se que você tem a ultima versão estável do [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/) rodando localmente.


Mude para a pasta `front-end`:

```
cd front-end
```

Depois, dentro da pasta, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Em seguida, inicialize a aplicação

```
npm run start

```

Lembre-se de ativar o servidor antes! E consulte o arquivo `.env.example` para configurar as variáveis de ambiente.

#### Testes Ponta a Ponta

Para rodar os testes ponta a ponta, execute o servidor em modo teste, como mostrado anteriormente, para então utilizar o **cypress** da seguinte forma:

```
npx cypress open
```

Dentro do **cypress** basta acessar os testes e executá-los.
