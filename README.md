# API IRON Challenge

A API IRON Challenge é um sistema backend desenvolvido para gerenciar competições em academias, fornecendo funcionalidades como criação de usuários, atualização de informações e consulta. A aplicação utiliza tecnologias modernas, como Node.js, TypeScript e MongoDB, garantindo escalabilidade, segurança e facilidade de manutenção.


## **Rotas Disponíveis**

### Autenticação
A principio iria fazer autenticação pela api, sendo que estava sendo feito ate a rota e middleware para autenticação, porem sera feito no firebase.

### **Usuários**

#### **1. Criar Usuário**
- **Endpoint:** `POST /users`  
- **Descrição:** Cria um novo usuário com base em um token único.  
- **Parâmetros:**  
  - **Body:**  
    ```json
    {
      "token": "string"
    }
    ```
- **Respostas:**
  - **201:** Usuário criado com sucesso.
  - **409:** Usuário já existe.

#### **2. Consultar Usuário**
- **Endpoint:** `GET /users/:token`  
- **Descrição:** Retorna os dados de um usuário específico.  
- **Parâmetros:**  
  - **Path:** `token` (string) - Token único do usuário.
- **Respostas:**
  - **200:** Usuário encontrado.
  - **404:** Usuário não encontrado.

#### **3. Atualizar Usuário**
- **Endpoint:** `PUT /users/:token`  
- **Descrição:** Atualiza as informações de um usuário.  
- **Parâmetros:**  
  - **Path:** `token` (string) - Token único do usuário.  
  - **Body:**  
    ```json
    {
      "field": "value"
    }
    ```
    *(Exemplo: Atualizar nome, e-mail, etc.)*
- **Respostas:**
  - **200:** Usuário atualizado com sucesso.
  - **404:** Usuário não encontrado.


#### **4. Criar Evento**
- **Endpoint:** `POST /event`  
- **Descrição:** Cria um novo evento com categorias e requisitos de peso.  
- **Requer Autenticação:** Sim — Token enviado no header como `Authorization: Bearer <token>`
#### 📥 Body
```json
{
  "name": "Campeonato de Crossfit",
  "description": "Competição anual de Crossfit",
  "startDate": "2025-04-10T08:00:00.000Z",
  "finishDate": "2025-04-12T18:00:00.000Z",
  "categories": [
    {
      "name": "Crossfit",
      "weightRequirement": 70
    },
    {
      "name": "Strongman",
      "weightRequirement": 90
    }
  ]
}
```

#### 📤 Respostas
- **201 Created**
```json
{
  "message": "Evento criado com sucesso!",
  "event": {
    "_id": "66371f8019b06cd18282a5d0",
    "name": "Campeonato de Crossfit",
    "description": "Competição anual de Crossfit",
    "startDate": "2025-04-10T08:00:00.000Z",
    "finishDate": "2025-04-12T18:00:00.000Z",
    "categories": [
      "66371f8019b06cd18282a5cf",
      "66371f8019b06cd18282a5ce"
    ],
    "createdAt": "2025-04-10T10:00:00.000Z",
    "updatedAt": "2025-04-10T10:00:00.000Z"
  }
}
```

#### ⚠️ Erros possíveis
| Código | Motivo |
|--------|--------|
| 400    | Token ausente ou campos obrigatórios inválidos |
| 409    | Evento já existe |
| 500    | Erro interno do servidor |


---



## Tecnologias Principais

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework web para Node.js.
- **MongoDB**: Banco de dados NoSQL.
- **TypeScript**: Linguagem de programação tipada.
- **Swagger UI Express**: Ferramenta para documentação e teste de APIs.
- **Mongoose**: Biblioteca para modelagem de objetos MongoDB.
- **Celebrate**: Middleware para validação de dados.
- **Express Async Errors**: Tratamento de erros assíncronos no Express.
- **tsyringe**: Biblioteca de injeção de dependência.

## Scripts

- `build`: Compila o código TypeScript para a pasta `dist`.
- `start`: Inicia o servidor Node.js a partir do diretório `dist`.
- `dev`: Inicia o servidor Node.js em modo de desenvolvimento, com reinicialização automática.
- `test`: Comando para executar testes (ainda não implementados).
- `typeorm`: Comando para executar a CLI do TypeORM.

## Instalação e Uso

1. **Clone o repositório**:

```bash
git clone https://github.com/seu-usuario/"colocar_reposito.git"
cd iron-challenge-api
```
2. **Instale as dependências:**:
```bash
npm install
ou
yarn
```
2. **Configure as variáveis de ambiente:**:
- Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
Certifique-se de configurar corretamente a MONGODB_URI com sua própria URL do MongoDB.
```bash
PORT=3000
MONGODB_URI=sua_url_de_conexão_com_o_MongoDB
```
3. **Execute o servidor em modo de desenvolvimento:**:
```bash
npm run dev
yarn dev
```

3. **Acesse a documentação da AP:**:
# Não Implementado ainda
- Após iniciar o servidor, a documentação Swagger estará disponível em:
```bash
http://localhost:3000/api-docs
```

## Estrutura do Projeto
A estrutura do projeto está organizada da seguinte forma:
```bash
iron-challenge-api/
│
├── dist/                 # Código compilado
├── src/                  # Código-fonte TypeScript
│   ├── configs/          # Configurações da aplicação
│   ├── functions/        # Funções da aplicação│   │   
│   ├── infra/            # Infraestrutura
│   │   ├── entities/     # Entidades
│   │   └── http/         # Camada HTTP
│   │       ├── controller/  # Controladores HTTP
│   │       └── routes/      # Rotas HTTP
│   ├── interfaces/       # Interfaces da aplicação
│   │   └── Responses/    # Respostas
│   ├── services/         # Serviços da aplicação
│   └── shared/           # Compartilhado
│       ├── errors/       # Erros
│       ├── infra/        # Infraestrutura compartilhada
│       │   └── http/     # Camada HTTP compartilhada
│       │       └── mongodb/  # MongoDB
│       └── http/         # Camada HTTP compartilhada
│           ├── controller/  # Controladores HTTP compartilhados
│           └── routes/      # Rotas HTTP compartilhadas
│
├── .env                  # Arquivo de configuração de variáveis de ambiente
├── .editorconfig         # Configuração do editor
├── .eslintignore         # Arquivos e diretórios a serem ignorados pelo ESLint
├── .eslintrc.json        # Configuração do ESLint
├── .gitignore            # Arquivos e diretórios a serem ignorados pelo Git
├── LICENSE               # Licença do projeto
├── package.json          # Lista de dependências e scripts
├── prettier.config.js    # Configuração do Prettier
├── README.md             # Informações sobre o projeto
└── tsconfig.json         # Configuração do TypeScript



```