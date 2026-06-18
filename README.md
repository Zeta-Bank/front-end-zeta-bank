# 💻 Zeta Bank — Front-end

> Interface web do sistema bancário Zeta Bank, construída com HTML, CSS e JavaScript puro. Consome a [API Back-end](https://github.com/Zeta-Bank/Api-Back-end) via Axios e gerencia a sessão do usuário com `localStorage`.

---

## 📋 Índice

- [Sobre](#-sobre)
- [Tecnologias](#-tecnologias)
- [Estrutura de Arquivos](#-estrutura-de-arquivos)
- [Páginas](#-páginas)
  - [Login](#-login--indexhtml)
  - [Cadastro](#-cadastro--registerhtml)
  - [Dashboard](#-dashboard--dashboardhtml)
- [Arquitetura JavaScript](#-arquitetura-javascript)
- [Design System](#-design-system)
- [Como executar](#-como-executar)
- [Integração com a API](#-integração-com-a-api)
- [Limitações e Pontos de Atenção](#-limitações-e-pontos-de-atenção)

---

## 📌 Sobre

O front-end do Zeta Bank é uma aplicação web **sem framework**, composta por três páginas HTML que cobrem o fluxo completo do usuário: cadastro, login e painel bancário. A comunicação com o back-end é feita via Axios, e o estado de sessão é mantido no `localStorage` do navegador.

---

## 🛠 Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização com CSS Variables e CSS Grid |
| JavaScript (ES2020+) | Lógica da aplicação (Vanilla JS) |
| [Axios](https://axios-http.com/) | Requisições HTTP (via CDN) |

> Nenhum bundler, framework ou dependência npm. O projeto roda diretamente no navegador.

---

## 📂 Estrutura de Arquivos

```
front-end-zeta-bank/
│
├── index.html             # Página de login
├── register.html          # Página de cadastro
├── dashboard.html         # Painel principal do usuário
│
├── css/
│   ├── main.css           # Entry point do CSS (importa todos os outros)
│   ├── variables.css      # Design tokens: cores, sombras, bordas, tipografia
│   ├── components/
│   │   └── buttons.css    # Botões, inputs e form-groups
│   └── pages/
│       ├── auth.css       # Estilos das páginas de login e cadastro
│       └── dashboard.css  # Estilos do painel (grid, cards, tabela, responsivo)
│
└── js/
    ├── api.js             # Instância Axios, UserSession e utilitários de UI
    ├── auth.js            # Lógica de login e cadastro
    └── dashboard.js       # Lógica do painel: saldo, Pix, transferências, histórico
```

---

## 🖥 Páginas

### 🔐 Login — `index.html`

Formulário de acesso à conta. O usuário informa e-mail e senha. Se já estiver autenticado (sessão ativa no `localStorage`), é redirecionado automaticamente para o dashboard.

**Campos:**
- E-mail
- Senha

**Fluxo:** `GET /users/email/{email}` → salva dados no `localStorage` → redireciona para `dashboard.html`

> ⚠️ Veja a seção de [limitações](#-limitações-e-pontos-de-atenção): a senha **não é validada** no back-end neste momento.

---

### 📝 Cadastro — `register.html`

Formulário de criação de conta. Ao finalizar o cadastro com sucesso, o usuário é redirecionado para a página de login.

**Campos:**
- Nome e Sobrenome (em linha)
- E-mail
- CPF (formato `000.000.000-00`)
- Senha

**Fluxo:** `POST /users` → redireciona para `index.html`

---

### 📊 Dashboard — `dashboard.html`

Painel principal do usuário autenticado. Layout em grid responsivo com quatro seções:

| Card | Descrição |
|---|---|
| **Saldo Atual** | Exibe o saldo da conta com toggle de visibilidade (mostrar/esconder) |
| **Nova Transferência** | Formulário para enviar Pix via chave do destinatário e valor |
| **Minhas Chaves Pix** | Gerar chaves do tipo `EMAIL` ou `ALEATÓRIA` e listar as existentes |
| **Histórico de Transações** | Tabela com todas as transferências enviadas e recebidas |

**Proteção de rota:** se não houver sessão no `localStorage`, redireciona para `index.html`.

---

## ⚙️ Arquitetura JavaScript

### `api.js` — Base compartilhada

Carregado em todas as páginas. Exporta dois objetos globais:

```javascript
// Instância Axios configurada
const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' }
});

// Gerenciamento de sessão via localStorage
const UserSession = {
    save(userData)      // Persiste dados do usuário
    get()               // Retorna dados da sessão atual
    clear()             // Remove a sessão (logout)
    isAuthenticated()   // Verifica se há sessão ativa
};

// Utilitários de interface
const UI = {
    showToast(message, type)  // Feedback visual ao usuário
    formatCurrency(value)     // Formata valor em R$ (pt-BR)
};
```

---

### `auth.js` — Login e Cadastro

Gerencia os eventos de submit dos formulários `#login-form` e `#register-form`. Realiza redirecionamento automático se o usuário já tiver sessão ativa.

---

### `dashboard.js` — Painel Principal

Orquestra todos os cards do dashboard com as seguintes funções:

```
loadDashboardData()  →  busca saldo atualizado, carrega Pix e histórico
loadPixKeys()        →  GET /pix/{userId}     → renderiza lista de chaves
loadHistory()        →  GET /transferencia/{userId} → renderiza tabela
```

**Eventos tratados:**
- Toggle de visibilidade do saldo
- Submit do formulário de transferência → `POST /transferencia`
- Clique em "Gerar Chave" → `POST /pix`
- Botão de logout → limpa `localStorage` e redireciona

---

## 🎨 Design System

Todas as variáveis visuais estão centralizadas em `css/variables.css`:

| Variável | Valor | Uso |
|---|---|---|
| `--primary-color` | `#2563eb` | Botões, links, foco de input |
| `--secondary-color` | `#0f172a` | Textos, header, botão secundário |
| `--bg-color` | `#f8fafc` | Fundo da página |
| `--text-color` | `#1e293b` | Texto principal |
| `--error-color` | `#ef4444` | Mensagens de erro |
| `--success-color` | `#22c55e` | Mensagens de sucesso |
| `--border-radius` | `8px` | Cards e inputs |
| `--shadow` | `box-shadow suave` | Cards e modais |

**Tipografia:** Inter → `-apple-system` → `BlinkMacSystemFont` → `Segoe UI` → Roboto

**Layout do dashboard:** CSS Grid com `auto-fit` e `minmax(300px, 1fr)`, colapsa para coluna única abaixo de `768px`.

---

## ▶️ Como executar

O projeto não requer instalação. Basta servir os arquivos estáticos localmente.

### Opção 1 — VS Code Live Server

Instale a extensão **Live Server** no VS Code, clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

### Opção 2 — Python HTTP Server

```bash
# Clone o repositório
git clone https://github.com/Zeta-Bank/front-end-zeta-bank.git
cd front-end-zeta-bank

# Python 3
python3 -m http.server 3000
```

Acesse: `http://localhost:3000`

### Opção 3 — npx serve

```bash
npx serve .
```

> **Importante:** o back-end precisa estar rodando em `http://localhost:8080` para que as requisições funcionem. Veja [Api-Back-end](https://github.com/Zeta-Bank/Api-Back-end).

---

## 🔌 Integração com a API

A URL base da API é configurada em `js/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080'; // Altere conforme necessário
```

Mapa de chamadas realizadas pelo front-end:

| Ação | Método | Endpoint |
|---|---|---|
| Login (busca por e-mail) | `GET` | `/users/email/{email}` |
| Cadastro | `POST` | `/users` |
| Buscar saldo atualizado | `GET` | `/users/{id}` |
| Listar chaves Pix | `GET` | `/pix/{userId}` |
| Criar chave Pix | `POST` | `/pix` |
| Realizar transferência | `POST` | `/transferencia` |
| Histórico de transações | `GET` | `/transferencia/{userId}` |

---

## ⚠️ Limitações e Pontos de Atenção

### Autenticação sem validação de senha
O endpoint de login simula a autenticação buscando o usuário pelo e-mail (`GET /users/email/{email}`). A senha digitada **não é verificada**. Isso ocorre pois o back-end não possui um endpoint de autenticação dedicado (`POST /login`). Em um sistema real, isso seria um risco crítico de segurança.

```javascript
// auth.js — comentário original do código
// Como não há endpoint de login, buscamos o usuário pelo e-mail
// Nota: Em um sistema real, isso seria um POST /login
```

### Sessão via localStorage
Os dados do usuário (incluindo e-mail e CPF) são salvos em texto no `localStorage` do navegador. Não há token JWT ou cookie seguro. O logout limpa manualmente essa entrada.

### Feedback visual com `alert()`
O sistema de notificações (`UI.showToast`) usa `alert()` nativo do navegador como placeholder. Deve ser substituído por um componente de toast visual para uma experiência adequada.

```javascript
// api.js
showToast(message, type = 'success') {
    alert(`${type.toUpperCase()}: ${message}`); // placeholder
}
```

### CORS
Todas as requisições partem de uma origem diferente da API (`localhost:3000` → `localhost:8080`). O back-end já está configurado com `@CrossOrigin(origins = "*")` para uso local, o que deve ser restringido em produção.

---

## 🔗 Repositórios relacionados

| Repositório | Descrição |
|---|---|
| [Api-Back-end](https://github.com/Zeta-Bank/Api-Back-end) | API REST em Spring Boot |
| [data-base-mysql](https://github.com/Zeta-Bank/data-base-mysql) | Script SQL de criação do banco de dados |

---

*Parte do ecossistema Zeta Bank.*
