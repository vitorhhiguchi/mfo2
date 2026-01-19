# MFO Backend API

Este é o serviço de backend para a ferramenta de projeção patrimonial MFO. Ele fornece uma API RESTful construída com Fastify e Prisma para gerenciar clientes, simulações e todos os cálculos financeiros associados.

## 🛠 Tecnologias

*   **Runtime**: Node.js (v20+)
*   **Framework**: [Fastify](https://www.fastify.io/) - Escolhido pela sua baixa sobrecarga e alta performance.
*   **Linguagem**: TypeScript.
*   **Banco de Dados**: PostgreSQL.
*   **ORM**: [Prisma](https://www.prisma.io/) - Para modelagem de dados declarativa e migrações seguras.
*   **Validação**: [Zod](https://zod.dev/) - Para validação de esquemas e inferência de tipos.
*   **Testes**: Jest e Supertest.

## 📂 Estrutura de Pastas

```
src/
├── controllers/  # Manipuladores de requisição HTTP (Entrada)
├── services/     # Lógica de negócios pura (Core)
├── routes/       # Definição de rotas da API
├── lib/          # Configurações (ex: instância do Prisma)
├── config/       # Variáveis de ambiente e constantes
└── server.ts     # Ponto de entrada da aplicação
```

## 🚀 Getting Started

### Instalação

```bash
npm install
```

### Banco de Dados

Certifique-se que o PostgreSQL está rodando (via Docker ou local).
Configuração padrão no `docker-compose.yml` da raiz:
- User: `planner`
- Pass: `plannerpw`
- DB: `plannerdb`

**Aplicar Migrações:**
```bash
npx prisma migrate dev
```
Isso criará as tabelas necessárias no banco de dados.

### Execução

**Modo Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo Produção:**
```bash
npm run build
npm start
```

## 🧪 Testes

O projeto possui uma suíte de testes robusta.

*   `npm run test`: Executa todos os testes.
*   `npm run test:unit`: Foca nos testes de unidade dos Services.
*   `npm run test:integration`: Testa os endpoints da API real usando um banco de dados de teste (ou mockado).
*   `npm run test:coverage`: Gera relatório de cobertura de código.

## 🔑 Principais Endpoints

### Simulações (`/simulations`)
*   `POST /`: Cria uma nova simulação.
    *   *Feature*: Suporta criação "Deep Copy" de uma versão anterior se `baseSimulationId` for fornecido.
*   `GET /?clientId=...`: Lista simulações de um cliente.
*   `GET /:id`: Detalhes completos de uma simulação.

### Projeção (`/projection`)
*   `GET /:id`: Retorna os dados calculados para o gráfico de projeção (evolução do patrimônio ano a ano).

### Assets, Movements, Insurances
*   CRUDs padrão para gerenciamento das entidades financeiras vinculadas a uma simulação.

## ⚠️ Notas de Implementação

*   **Tratamento de Erros**: Utiliza um handler global do Fastify para padronizar respostas de erro (ZodError, PrismaError, etc).
*   **BigInt**: O Prisma mapeia `BigInt` do banco, mas a API serializa para JSON tratando esses valores adequadamente (serialização customizada implementada no server).
