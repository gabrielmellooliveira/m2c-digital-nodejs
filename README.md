# M2C Digital API

Sistema da M2C Digital responsável por gerenciar usuários, empresas e campanhas de mensagens.

## Rodando o projeto

### Instalando as dependencias

Após baixar o projeto na sua máquina, rode o seguinte comando para instalar as dependencias do mesmo:

```
yarn
```

### Docker Compose

Para criar a instância do ```postgres``` e do ```rabbitMQ``` com Docker Compose, deve ser utilizado o seguinte comando:

```
docker-compose up -d
```

### Variaveis de ambiente

No projeto, há um arquivo chamado ```.env-example``` em que as informações devem ser copiadas para um arquivo chamado ```.env```.

Caso necessário, poderá alterar as informações do .env para apontar para sua aplicação, banco de dados ou ferramenta.

### Inicializando o projeto

Para rodar o projeto, utilize o comando:

```
yarn start
```

## Postman

Para realizar os testes nos endpoints da API, utilize o arquivo ```postman_collection.json``` na aplicação do postman.
