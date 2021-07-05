# Angular Portinari Boilerplate

![Screenshot](docs/home.jpeg)

Model of project to work as base to work with Angular and portinari Io.
This project was creates using this technologies.

[Angular CLI 12.1.0](https://github.com/angular/angular-cli)

[Portinari Io](https://po-ui.io/)

[ESLint](https://eslint.org/)

[Prettier](https://prettier.io/)

## Índice

- [Índice](#índice)
- [Getting Started](#getting_started)
- [project structure](#project_structure)

## Getting Started

### cloning this project using serverless command

```bash
git clone git@github.com:DaniiloLacerda/angular-portinari-boilerplate.git yourNameProject
```

### follow the steps of this project to have the server

[Server project](https://github.com/DaniiloLacerda/serverless-mongo-jest-boilerplate)

### install dependencies of project

```bash
yarn
```

### development server

```bash
yarn start
```

## project structure

```
└── src
    ├── app
    │   ├── core
    │   │   ├── constants
    │   │   ├── guard
    │   │   ├── interceptor
    │   │   ├── model
    │   │   └── service
    │   ├── page
    │   │   ├── auth
    │   │   │   └── login
    │   │   ├── home
    │   │   │   └── shared
    │   │   ├── movie
    │   │   │   ├── movie-detail
    │   │   │   ├── movie-form
    │   │   │   ├── movie-list
    │   │   │   └── shared
    │   │   └── report
    │   └── shared
    │       ├── component
    │       │   └── base-resource
    │       ├── enum
    │       ├── interface
    │       ├── model
    │       │   ├── base-resource
    │       │   └── config-model
    │       ├── service
    │       └── utils
    ├── assets
    │   └── icons
    └── environments
```
