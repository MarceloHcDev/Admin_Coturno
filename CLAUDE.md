# **Contexto do Projeto e Guia de Componentes: Painel Administrativo \- Coturno & Cia**

Claude, você é um desenvolvedor Front-end (TypeScript, React e Tailwind CSS) Sênior, que me auxilia na implementação de novas estruturas e ajustes de código dentro desse projeto.  
Este documento serve como memória de contexto oficial e especificação técnica para o desenvolvimento do front-end do painel administrativo do e-commerce **Coturno & Cia**. Toda e qualquer evolução da interface deve respeitar as diretrizes, tecnologias, ciclo de vida e padrões de arquitetura aqui registrados.

## ---

**🛠️ Stack Tecnológica & Padrões**

> * **Framework Principal:** React com **TypeScript**.  
> * **Roteamento:** React Router (BrowserRouter, Routes, Route, useLocation, useNavigate).  
> * **Estilização:** Tailwind CSS (Uso estrito de classes utilitárias importadas via arquivo global centralizado).  
> * **Arquitetura de Componentes:** **Atomic Design** (Divisão estrita em Átomos, Moléculas, Organismos e Páginas).  
> * **Ícones:** SVG nativo componentizado em React com tipagem de props dentro do ecossistema de Átomos (sem dependências externas de pacotes de terceiros).  
> * **Acessibilidade:** Uso de tags semânticas HTML5 (como \<aside\>, \<main\>, \<section\>, \<table\>, \<form\>) e interações tratadas com elementos nativos interativos ou componentes de navegação controlada (\<button\>, \<input\>, \<select\>).  
> * **Tipagem de Dados:** Contratos centralizados na pasta src/types/ garantindo a integridade e segurança de compilação dos dados em toda a aplicação.

## ---

**📂 1\. Arquitetura de Pastas e Arquivos**

O projeto adota uma estrutura modular estrita com arquivos em **TypeScript (.tsx e .ts)**, onde os componentes são categorizados por complexidade, acoplamento e nível de responsabilidade, incluindo a nova pasta de tipagens em src/types/:  
`src/`  
`├── assets/                  # Imagens estáticas, logotipos e vetores globais`  
`├── components/`  
`│   ├── atoms/               # Menores unidades funcionais (puramente visuais/isoladas com tipagem TSX)`  
`│   │   ├── Icons.tsx        # Coleção centralizada de caminhos SVG do sistema (Dashboard, Produtos, Usuários, Sair, Lupa, EditButton, DeleteButton, UserIcon, etc.)`  
`│   │   ├── InputField.tsx   # Input de texto padrão com label e placeholder estilizados`  
`│   │   ├── SearchInput.tsx  # Input específico para buscas com ícone de lupa acoplado`  
`│   │   ├── SelectField.tsx  # Menu dropdown customizado para seleção de dados em formulários`  
`│   │   ├── StatusBadge.tsx  # Tag colorida/elíptica para status de estoque ou tipos de usuário (Cliente, VIP, Administrador)`  
`│   │   └── UserIcon.tsx     # Placeholder circular com avatar estilizado em SVG para listagens`  
`│   │`  
`│   ├── molecules/           # Combinações de átomos com uma única responsabilidade funcional`  
`│   │   ├── Chartheader.tsx         # Cabeçalho interno para cartões ou seções de gráficos`  
`│   │   ├── DashboardHeader.tsx     # Título e subtítulo textual para o topo da dashboard analítica`  
`│   │   ├── MetricCard.tsx          # Card indicador de KPI com valor, variação percentual e mini-gráfico vetorial`  
`│   │   ├── PageHeader.tsx          # Topo das páginas de gestão (Título, subtítulo e Botão de Ação principal opcional com controle de visibilidade)`  
`│   │   ├── ProductRow.tsx          # Linha de dados individuais (<tr>) de um produto para a tabela`  
`│   │   ├── ProductTableHeader.tsx   # Cabeçalho estrutural (<thead>) com os títulos das colunas de produtos`  
`│   │   ├── SearchUserBar.tsx       # Barra de pesquisa refinada (ou container de busca) para tabelas`  
`│   │   ├── SidebarNavItem.tsx      # Item de link individual da barra lateral (Ícone + Texto + Estado Ativo)`  
`│   │   └── UserRow.tsx             # Linha de dados individuais (<tr>) de um usuário para a tabela`  
`│   │`  
`│   └── organisms/           # Estruturas complexas formadas por moléculas e/ou átomos que gerenciam seções da UI`  
`│       ├── ChartsSection.tsx       # Grid analítico que gerencia e renderiza os gráficos da Dashboard`  
`│       ├── MetricsGrid.tsx         # Grid superior que organiza os 4 MetricCards de KPIs principais`  
`│       ├── ProductTable.tsx        # Tabela completa de produtos (Header, Estrutura de busca e loop de ProductRows)`  
`│       ├── Sidebar.tsx             # Barra de navegação lateral fixa (Logo, Lista de Itens e Botão de Sair)`  
`│       ├── TopProductsSection.tsx  # Seção analítica para a listagem/destaque de produtos mais vendidos`  
`│       ├── UserTable.tsx           # Tabela completa de usuários (Header, Estrutura de busca adaptada para equivalência com colunas do Mockup e proteção de array opcional)`  
`│       └── StoreImagesForm.tsx     # Formulário/organismo de gestão dos banners e imagens promocionais da loja`  
`├── pages/                   # Componentes de nível de página que representam as telas associadas às rotas`  
`│   ├── Home_admin.tsx       # Página do Dashboard Analítico Principal`  
`│   ├── Produtos_Catalogo.tsx # Página de Gerenciamento de Estoque/Produtos (Listagem e Cadastro)`  
`│   ├── Usuarios_Gestao.tsx   # Página de Gerenciamento e Cadastro de Usuários`  
`│   ├── LogEventos.tsx       # Página de Monitoramento e Auditoria de Ações do Sistema (Logs de Eventos)`  
`│   └── Edicao_Imagens.tsx   # Página de Gerenciamento de Banners e Imagens Promocionais da Loja`  
`├── types/                   # Definições de interfaces e tipos TypeScript centralizados`  
`│   ├── pages.ts             # Tipos e interfaces relacionados às páginas e estruturas de navegação/header`  
`│   ├── product.ts           # Interfaces e tipos para gestão de Produtos e Catálogo`  
`│   └── user.ts              # Interfaces e tipos para Usuários, Permissões e Perfis`  
`├── App.tsx                  # Componente Raiz com a declaração central do Router em TypeScript`  
`└── main.tsx                 # Ponto de entrada da aplicação React`

## ---

**🏷️ 2\. Tipagens Centralizadas (src/types/)**

### **src/types/product.ts**

Define a estrutura de dados para o gerenciamento de produtos, inventário e catálogo:  
`export type ProductStatus = 'Em Estoque' | 'Pouco Estoque' | 'Esgotado';`

`export interface Product {`  
  `id: string | number;`  
  `nome: string;`  
  `categoria: string;`  
  `preco: number;`  
  `estoque: number;`  
  `status: ProductStatus;`  
  `imagemUrl?: string;`  
  `sku?: string;`  
`}`

`export interface ProductFilters {`  
  `busca: string;`  
  `categoria?: string;`  
  `status?: ProductStatus;`  
`}`

### **src/types/user.ts**

Define a estrutura de dados para gestão de usuários, papéis (roles) e permissões no sistema:  
`export type UserRole = 'Administrador' | 'VIP' | 'Cliente';`

`export interface User {`  
  `id: string | number;`  
  `nome: string;`  
  `email: string;`  
  `tipo: UserRole;`  
  `dataCadastro?: string;`  
  `avatarUrl?: string;`  
  `ativo?: boolean;`  
`}`

`export interface UserFilters {`  
  `busca: string;`  
  `tipo?: UserRole;`  
`}`

### **src/types/pages.ts**

Define estruturas reutilizáveis para os cabeçalhos de páginas, métricas e eventos de log:  
`export interface PageHeaderProps {`  
  `title: string;`  
  `subtitle?: string;`  
  `showActionButton?: boolean;`  
  `actionButtonText?: string;`  
  `onActionButtonClick?: () => void;`  
`}`

`export interface MetricCardData {`  
  `id: string | number;`  
  `title: string;`  
  `value: string | number;`  
  `percentageChange?: number;`  
  `isPositive?: boolean;`  
`}`

`export interface LogEvent {`  
  `id: string | number;`  
  `usuario: string;`  
  `acao: string;`  
  `dataHora: string;`  
  `detalhes?: string;`  
`}`

## ---

**📄 3\. Páginas Implementadas**

### **src/pages/Edicao\_Imagens.tsx**

Página de gestão visual da loja, responsável por centralizar a edição de banners, imagens promocionais e destaques visuais exibidos na vitrine do e-commerce.

* **Layout:** Segue o padrão estrutural das demais páginas administrativas — `Sidebar` fixa à esquerda (organismo) \+ área de conteúdo principal (`<main>`) deslocada com `pl-72` para compensar a largura da sidebar.  
* **Composição:**  
  * `Sidebar` — Navegação lateral fixa, reaproveitada de todas as páginas do painel.  
  * `PageHeader` — Cabeçalho com título "Edição de Imagens da Loja" e subtítulo descritivo, com o botão de ação principal **oculto** (uso da prop `hideButton`).  
  * `StoreImagesForm` — Novo organismo responsável pelo formulário/gestão de upload e edição das imagens da loja.  
* **Estilização:** Fundo `bg-slate-50`, texto `text-slate-900`, suavização `antialiased`, com espaçamento `pe-10 pt-10` no container raiz.

⚠️ **Nota de consistência de tipagem:** O componente `PageHeader` foi utilizado aqui com a prop `hideButton={true}`, enquanto a interface `PageHeaderProps` (em `src/types/pages.ts`) define atualmente `showActionButton?: boolean`. Essas props têm semânticas opostas (esconder vs. mostrar) e não estão alinhadas — é necessário padronizar `PageHeader.tsx` e `PageHeaderProps` para usar uma única convenção (recomenda-se manter `showActionButton`, com valor padrão `true`, para não quebrar o uso já existente nas demais páginas).