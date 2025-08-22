-<p align="center">
<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Sobre

Esta API foi desenvolvida para solucionar um desafio proposto no desafio para posição de desenvolvedor Node pleno na Brasil Card.

[Vídeo DEMO - usando o projeto](https://drive.google.com/file/d/1vZ5J6bJs5NOgvT96roCfiumCnRFXgev8/view?usp=sharing)

[Confira o documento do desafio clicando aqui](https://drive.google.com/file/d/1scBgrBC8JnJmLqWwTcaWviWdHQnXy9eV/view?usp=sharing)

[Confira o swagger desta API clicando aqui](https://bca-challenge-119502210538.southamerica-east1.run.app/api)

## Descrição da API

é uma aplicação RESTful desenvolvida com **NestJS** e **TypeScript**, seguindo os princípios da **Clean Architecture**. O objetivo é gerenciar transações financeiras e fornecer estatísticas em tempo real, com foco em qualidade de código, boas práticas e segurança.

## Estrutura do Projeto

O projeto está organizado da seguinte maneira:

```
transactions-api/
├── src/
│   ├── common/          # Contém utilitários e pipes globais
│   │   ├── pipes/       # Pipes para validação e transformação de dados
│   │   └── utils/       # Funções utilitárias
│   ├── infra/           # Infraestrutura e configurações globais
│   │   ├── config/      # Configurações da aplicação
│   │   ├── database/    # Serviços relacionados ao banco de dados em memória utilizando o KeyV
│   │   ├── exceptions/  # Tratamento de exceções globais
│   │   └── logger/      # Serviço de logs estruturados
│   ├── modules/         # Módulos principais da aplicação
│   │   ├── health/      # Módulo de health check
│   │   │   └── http/    # Entry point para o health check
│   │   ├── transactions/ # Módulo de transações financeiras
│   │   │   ├── dto/     # Objetos de transferência de dados (Data Transfer Objects)
│   │   │   ├── entities/ # Entidades de domínio
│   │   │   ├── exceptions/ # Exceções específicas do módulo
│   │   │   ├── http/    # Entry point para transações
│   │   │   ├── interfaces/ # Contratos e abstrações
│   │   │   ├── repositories/ # Repositórios para manipulação de dados em memória
│   │   │   └── use-cases/ # Casos de uso e lógica de negócios
│   │   └── statistics/   # Módulo de estatísticas
│   │       ├── dto/      # Objetos de transferência de dados
│   │       ├── http/     # Entry point para estatísticas
│   │       └── use-cases/ # Casos de uso e lógica de negócios
│   └── app.module.ts     # Módulo raiz da aplicação
├── .github/              # Configurações de workflows do GitHub Actions
│   └── workflows/        # Arquivos de CI/CD
├── test/                 # Testes de integração (end-to-end)
├── .env                  # Variáveis de ambiente
├── .gitignore            # Arquivos e pastas ignorados pelo Git
├── Dockerfile            # Configuração para containerização
├── docker-compose.yml    # Configuração para orquestração de containers
├── package.json          # Dependências e scripts do projeto
├── tsconfig.json         # Configuração do TypeScript
└── README.md             # Documentação do projeto
```

## Como Rodar

1. Clone o repositório
2. Instale as dependências com

```bash
$ pnpm install
```

3.Rode o projeto com

```bash

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

4. Você também pode optar por usar o Docker

```bash
$ docker compose up --build
```

## Documentação

A documentação da API está disponível no Swagger, que pode ser acessado em:

[Produção](https://bca-challenge-119502210538.southamerica-east1.run.app/api) <br/>
[Local](http://localhost:3000/api)

## Sobre os testes

### Unitários

Optei com que os testes unitários ficassem junto aos seus respectivos arquivos, mantendo assim uma melhor organização e facilidade de manutenção.

### Integração

Os testes de integração estão localizados na pasta `test` e utilizam o Supertest para simular requisições HTTP.

Para rodar os testes use:

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Como contribuir

1. Faça um fork do projeto
2. Use conventional commit para subir suas alterações
3. Abra um pull request
4. Para o PR ser aprovado precisará de no mínimo 1 approve e também que os testes tenham rodado com êxito, caso contrário não será aceito.

## Deployment

Para fazer deploy utilizei o serviço do Cloud Run do google cloud, pela facilidade de configuração e CD automático. E também por já configurar um DNS.

Você pode conferir o deploy deste projeto em: https://bca-challenge-119502210538.southamerica-east1.run.app.
