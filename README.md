# 💻 Zeta Bank — Front-end

> Interface web do sistema bancário Zeta Bank, construída com HTML, CSS e JavaScript puro. Consome a [API Back-end](https://github.com/Zeta-Bank/Api-Back-end) via Axios e gerencia a sessão do usuário com `localStorage`, o foco aqui é simplicidade e seguir as regras basicas de IHC.

---

## Índice

- [Sobre](#sobre)
- [Tecnologias](#tecnologias)
- [Páginas](#páginas)
  - [Login — index.html](#login--indexhtml)
  - [Cadastro — register.html](#cadastro--registerhtml)
  - [Dashboard — dashboard.html](#dashboard--dashboardhtml)
- [Como executar](#como-executar)
- [Integração com a API](#integração-com-a-api)
- [Limitações e Pontos de Atenção](#limitações-e-pontos-de-atenção)
- [Repositórios relacionados](#repositórios-relacionados)

---

## Sobre

O front-end do Zeta Bank é uma aplicação web **sem framework**, composta por três páginas HTML que cobrem o fluxo completo do usuário: cadastro, login e painel bancário. A comunicação com o back-end é feita via Axios, e o estado de sessão é mantido no `localStorage` do navegador.

---

## Tecnologias

| Tecnologia                       | Uso                                      |
| -------------------------------- | ---------------------------------------- |
| HTML5                            | Estrutura das páginas                    |
| CSS3                             | Estilização com CSS Variables e CSS Grid |
| JavaScript (ES2020+)             | Lógica da aplicação (Vanilla JS)         |
| [Axios](https://axios-http.com/) | Requisições HTTP (via CDN)               |

> Nenhum bundler, framework ou dependência npm. O projeto roda diretamente no navegador.

---

## Páginas

### Login — `index.html`

Formulário de acesso à conta. O usuário informa e-mail e senha. Se já estiver autenticado (sessão ativa no `localStorage`), é redirecionado automaticamente para o dashboard.

**Campos:**

- E-mail
- Senha

**Fluxo:** `GET /users/email/{email}` → salva dados no `localStorage` → redireciona para `dashboard.html`

---

### Cadastro — `register.html`

Formulário de criação de conta. Ao finalizar o cadastro com sucesso, o usuário é redirecionado para a página de login.

**Campos:**

- Nome e Sobrenome (em linha)
- E-mail
- CPF (formato `000.000.000-00`)
- Senha

**Fluxo:** `POST /users` → redireciona para `index.html`

---

### Dashboard — `dashboard.html`

Painel principal do usuário autenticado. Layout em grid responsivo com quatro seções:

| Card                        | Descrição                                                            |
| --------------------------- | -------------------------------------------------------------------- |
| **Saldo Atual**             | Exibe o saldo da conta com toggle de visibilidade (mostrar/esconder) |
| **Nova Transferência**      | Formulário para enviar Pix via chave do destinatário e valor         |
| **Minhas Chaves Pix**       | Gerar chaves do tipo `EMAIL` ou `ALEATÓRIA` e listar as existentes   |
| **Histórico de Transações** | Tabela com todas as transferências enviadas e recebidas              |

**Proteção de rota:** se não houver sessão no `localStorage`, redireciona para `index.html`.

---

##  Como executar

O projeto não requer instalação. Basta servir os arquivos estáticos localmente.

### VS Code Live Server

Instale a extensão **Live Server** no VS Code, clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

---

## Integração com a API

A URL base da API é configurada em `js/api.js`:

```javascript
const API_BASE_URL = "http://localhost:8080"; // Altere conforme necessário
```

Mapa de chamadas realizadas pelo front-end:

| Ação                     | Método | Endpoint                  |
| ------------------------ | ------ | ------------------------- |
| Login (busca por e-mail) | `GET`  | `/users/email/{email}`    |
| Cadastro                 | `POST` | `/users`                  |
| Buscar saldo atualizado  | `GET`  | `/users/{id}`             |
| Listar chaves Pix        | `GET`  | `/pix/{userId}`           |
| Criar chave Pix          | `POST` | `/pix`                    |
| Realizar transferência   | `POST` | `/transferencia`          |
| Histórico de transações  | `GET`  | `/transferencia/{userId}` |

---

## Limitações e Pontos de Atenção

### Autenticação sem validação de senha

O endpoint de login simula a autenticação buscando o usuário pelo e-mail (`GET /users/email/{email}`). A senha digitada **não é verificada**. Isso ocorre pois o back-end não possui um endpoint de autenticação dedicado (`POST /login`). Em um sistema real, isso seria um risco crítico de segurança.

```javascript
// auth.js — comentário original do código
// Como não há endpoint de login, buscamos o usuário pelo e-mail
// Nota: Em um sistema real, isso seria um POST /login
```

### Sessão via localStorage

Os dados do usuário (incluindo e-mail e CPF) são salvos em texto no `localStorage` do navegador. Não há token JWT ou cookie seguro. O logout limpa manualmente essa entrada.

### CORS

Todas as requisições partem de uma origem diferente da API (`localhost:3000` → `localhost:8080`). O back-end já está configurado com `@CrossOrigin(origins = "*")` para uso local, o que deve ser restringido em produção.

---

## Repositórios relacionados

| Repositório                                                     | Descrição                               |
| --------------------------------------------------------------- | --------------------------------------- |
| [Api-Back-end](https://github.com/Zeta-Bank/Api-Back-end)       | API REST em Spring Boot                 |
| [data-base-mysql](https://github.com/Zeta-Bank/data-base-mysql) | Script SQL de criação do banco de dados |
