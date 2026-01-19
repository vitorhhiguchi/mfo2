# Multi Family Office - Wealth Projection Tool (MFO v4)

Este projeto é uma ferramenta avançada de projeção patrimonial desenvolvida para escritórios de gestão de patrimônio (Multi Family Offices). Ele permite a criação de simulações financeiras detalhadas, gerenciamento de ativos, fluxos de caixa e seguros, com suporte a múltiplas versões de cenários para análise comparativa.

## 🚀 Visão Geral e Funcionalidades

O sistema foi projetado para oferecer flexibilidade e precisão nas projeções de longo prazo.

### ✨ Funcionalidades Principais

*   **Gestão de Clientes e Simulações**:
    *   Cadastro de clientes.
    *   Criação de múltiplas simulações por cliente.
    *   **Versionamento Inteligente**: Sistema de "Deep Copy" que permite criar novas versões de uma simulação (ex: "Cenário Otimista") preservando todos os dados da versão anterior, garantindo isolamento total entre cenários.
    *   **Simulações Legado**: Identificação e bloqueio de edição de versões antigas.
*   **Projeção Patrimonial Detalhada**:
    *   Motor de cálculo robusto que considera inflação, taxas de juros reais e valorização de ativos.
    *   Visualização gráfica interativa (Charts) da evolução do patrimônio.
    *   Linha do tempo (Timeline) visual para eventos de vida (ex: aposentadoria, vendas de ativos).
*   **Gestão de Ativos (Assets)**:
    *   Tipos suportados: Imóveis (Real Estate) e Ativos Financeiros.
    *   **Financiamento**: Suporte completo a fluxo de financiamentos, com cálculo de parcelas e impacto no fluxo de caixa.
*   **Gestão de Movimentações (Movements)**:
    *   Receitas e Despesas.
    *   Recorrência (Mensal, Anual, Única).
    *   Ajuste automático pela inflação.
*   **Gestão de Seguros (Insurances)**:
    *   Tipos: Vida, Invalidez, Saúde, Propriedade, entre outros.
    *   Cálculo de prêmios e coberturas integrados ao fluxo.

## 🛠️ Stack Tecnológica

O projeto adota uma arquitetura moderna e escalável, separada em Frontend e Backend.

### Backend (Node.js)
*   **Framework**: Fastify (alta performance).
*   **ORM**: Prisma (Type-safe database access).
*   **Banco de Dados**: PostgreSQL.
*   **Validação**: Zod.
*   **Testes**: Jest (Unitários e de Integração).
*   **Arquitetura**: Camadas (Controllers, Services, Repositories/Prisma).

### Frontend (React/Next.js)
*   **Framework**: Next.js 14+ (App Router).
*   **UI Library**: Shadcn/UI (Baseado em Radix UI).
*   **Estilização**: Tailwind CSS.
*   **State Management**: TanStack Query (React Query) para server state.
*   **Formulários**: React Hook Form + Zod resolvers.
*   **Gráficos**: Recharts.
*   **Utils**: date-fns, axios.

## 📦 Estrutura do Projeto

```
mfo-v4/
├── backend/            # API Rest e Lógica de Negócios
├── frontend/           # Interface do Usuário (Next.js)
├── docker-compose.yml  # Orquestração do Banco de Dados
└── README.md           # Documentação Geral
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
*   Node.js (v20+)
*   Docker & Docker Compose (para o banco de dados)

### Passo 1: Iniciar a Infraestrutura (Banco de Dados)
Na raiz do projeto, execute:

```bash
docker-compose up -d
```
Isso iniciará o contêiner do PostgreSQL.

### Passo 2: Configurar e Rodar o Backend

1.  Navegue até a pasta `backend`:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure as variáveis de ambiente:
    *   Copie `.env.example` para `.env` (se houver) ou certifique-se que o `DATABASE_URL` no `schema.prisma` ou `.env` aponta para `postgresql://planner:plannerpw@localhost:5432/plannerdb`.
4.  Execute as migrações do banco:
    ```bash
    npx prisma migrate dev
    ```
5.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    O backend estará rodando em `http://localhost:3001`.

### Passo 3: Configurar e Rodar o Frontend

1.  Navegue até a pasta `frontend`:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure as variáveis de ambiente:
    *   Crie um arquivo `.env.local` na raiz do frontend.
    *   Adicione: `NEXT_PUBLIC_API_URL=http://localhost:3001`
4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    Acesse a aplicação em `http://localhost:3000`.

## 🧪 Testes

### Backend
Para rodar os testes automatizados do backend:
```bash
cd backend
npm run test           # Todos os testes
npm run test:unit      # Apenas unitários
npm run test:coverage  # Relatório de cobertura
```

## 📝 Decisões de Arquitetura

*   **Versionamento de Simulações**: Optamos por uma estratégia de deep copy via transação no banco de dados para garantir integridade. Ao duplicar uma simulação, todos os relacionamentos (movimentos, seguros) são duplicados, permitindo que a nova versão evolua independentemente.
*   **React Query no Frontend**: Utilizado para minimizar estados complexos de useEffect e garantir cache/revalidação automática dos dados, essencial para a fluidez na troca de simulações.
*   **Componentização UI**: Uso extensivo de Shadcn/UI para garantir acessibilidade e consistência visual com esforço mínimo de estilização.

---
**Desenvolvido para Teste Técnico - MFO v4**
