# MFO Frontend

Interface web moderna para a ferramenta de projeção patrimonial MFO, construída com foco em experiência do usuário, performance e visualização de dados.

## 🛠 Tecnologias

*   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router) - Para roteamento robusto, SSR e otimizações.
*   **Linguagem**: TypeScript.
*   **Componentes**: [Shadcn/UI](https://ui.shadcn.com/) - Componentes acessíveis e customizáveis baseados em Radix UI.
*   **Estilização**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS.
*   **Gerenciamento de Estado**: [TanStack Query (React Query)](https://tanstack.com/query/latest) - Para gerenciamento eficiente de estado do servidor, cache e revalidação.
*   **Formulários**: React Hook Form + Zod - Validação robusta e tipada.
*   **Visualização de Dados**: [Recharts](https://recharts.org/) - Gráficos compostos e responsivos.
*   **Ícones**: Lucide React.
*   **HTTP Client**: Axios.

## 📂 Estrutura do Projeto

```
src/
├── app/            # Páginas e Layouts (Next.js App Router)
│   ├── projection/ # Página principal de Projeção
│   ├── history/    # Histórico de Simulações
│   └── assets/     # Gestão de Ativos
├── components/
│   ├── ui/         # Componentes base do Shadcn (Button, Dialog, Input...)
│   ├── dashboard/  # Componentes de negócio (Cards, Editors, SimulationPill)
│   ├── assets/     # Componentes específicos de Ativos
│   └── charts/     # Componentes de Gráficos (Recharts wrappers)
├── hooks/          # Custom Hooks (useSimulation, useAssets, etc - encapsulam React Query)
├── services/       # Camada de comunicação com API (Axios calls)
├── types/          # Definições de Tipos TypeScript compartilhados
└── lib/            # Utilitários (cn, formatters)
```

## 🚀 Getting Started

### Pré-requisitos
Certifique-se de que o backend está rodando na porta `3001` (ou ajuste a variável de ambiente).

### Instalação

```bash
npm install
```

### Configuração
Crie um arquivo `.env.local` na raiz:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Execução

```bash
npm run dev
```
Acesse `http://localhost:3000`.

## ✨ Funcionalidades de Destaque

*   **Simulation Selector & Versioning**: Componente `SimulationPill` que permite navegar entre versões de simulação, indicando visualmente versões legado (read-only) e permitindo ações rápidas (duplicar, editar).
*   **Projeção Interativa**: A página `/projection` é um verdadeiro dashboard que integra entradas (Assets, Movements, Insurances) com feedback visual imediato nos gráficos.
*   **Formulários Modais**: Uso de Modais (`Dialog`) para todas as interações de edição, mantendo o usuário no contexto da análise.
*   **Validação em Tempo Real**: Zod garante que dados inseridos (como datas, valores positivos) estejam corretos antes de serem enviados à API.

## 🎨 Design System

O projeto segue um design system escuro e moderno, utilizando uma paleta de cores consistente definida no Tailwind config:
*   **Dark Mode** por padrão.
*   Cores semânticas para Financeiro: Verde (Income/Ganho), Vermelho (Expense/Perda).
*   Cores de Marca: Azul institucional para ações primárias.

## 🧪 Linting

```bash
npm run lint
```
Utiliza ESLint para garantir qualidade e consistência do código.
