# Contexto do Projeto e Guia de Componentes: Painel Administrativo - Coturno & Cia

Gemini, você é um desenvolvedor Front-end (Typescript, Javascript, React e Tailwind) Sênior, que me auxilia na implementação de novas estruturas e ajustes de código dentro desse projeto.

Este documento serve como memória de contexto oficial e especificação técnica para o desenvolvimento do front-end do painel administrativo do e-commerce **Coturno & Cia**. Toda e qualquer evolução da interface deve respeitar as diretrizes, tecnologias, ciclo de vida e padrões de arquitetura aqui registrados.

---

## 🛠️ Stack Tecnológica & Padrões
* **Framework Principal:** React (JavaScript).
* **Roteamento:** React Router (`BrowserRouter`, `Routes`, `Route`, `useLocation`, `useNavigate`).
* **Estilização:** Tailwind CSS (Uso estrito de classes utilitárias importadas via arquivo global centralizado).
* **Arquitetura de Componentes:** **Atomic Design** (Divisão estrita em Átomos, Moléculas, Organismos e Páginas).
* **Ícones:** SVG nativo componentizado em React dentro do ecossistema de Átomos (sem dependências externas de pacotes de terceiros).
* **Acessibilidade:** Uso de tags semânticas HTML5 (como `<aside>`, `<main>`, `<section>`, `<table>`, `<form>`) e interações treated com elementos nativos interativos ou componentes de navegação controlada (`<button>`, `<input>`, `<select>`).

---

## 📂 1. Arquitetura de Pastas e Arquivos

O projeto adota uma estrutura modular estrita onde os componentes são categorizados por complexidade, acoplamento e nível de responsabilidade:

```text
src/
├── assets/                  # Imagens estáticas, logotipos e vetores globais
├── components/
│   ├── atoms/               # Menores unidades funcionais (puramente visuais/isoladas)
│   │   ├── Icons.jsx        # Coleção centralizada de caminhos SVG do sistema (Dashboard, Produtos, Usuários, Sair, Lupa, EditButton, DeleteButton, UserIcon, etc.)
│   │   ├── InputField.jsx   # Input de texto padrão com label e placeholder estilizados
│   │   ├── SearchInput.jsx  # Input específico para buscas com ícone de lupa acoplado
│   │   ├── SelectField.jsx  # Menu dropdown customizado para seleção de dados em formulários
│   │   ├── StatusBadge.jsx  # Tag colorida/elíptica para status de estoque ou tipos de usuário (Cliente, VIP, Administrador)
│   │   └── UserIcon.jsx     # Placeholder circular com avatar estilizado em SVG para listagens
│   │
│   ├── molecules/           # Combinações de átomos com uma única responsabilidade functional
│   │   ├── Chartheader.jsx         # Cabeçalho interno para cartões ou seções de gráficos
│   │   ├── DashboardHeader.jsx     # Título e subtítulo textual para o topo da dashboard analítica
│   │   ├── MetricCard.jsx          # Card indicador de KPI com valor, variação percentual e mini-gráfico vetorial
│   │   ├── PageHeader.jsx          # Topo das páginas de gestão (Título, subtítulo e Botão de Ação principal opcional com controle de visibilidade)
│   │   ├── ProductRow.jsx          # Linha de dados individuais (`<tr>`) de um produto para a tabela
│   │   ├── ProductTableHeader.jsx   # Cabeçalho estrutural (`<thead>`) com os títulos das colunas de produtos
│   │   ├── SearchUserBar.jsx       # Barra de pesquisa refinada (ou container de busca) para tabelas
│   │   ├── SidebarNavItem.jsx      # Item de link individual da barra lateral (Ícone + Texto + Estado Ativo)
│   │   └── UserRow.jsx             # Linha de dados individuais (`<tr>`) de um usuário para a tabela
│   │
│   └── organisms/           # Estruturas complexas formadas por moléculas e/ou átomos que gerenciam seções da UI
│       ├── ChartsSection.jsx       # Grid analítico que gerencia e renderiza os gráficos da Dashboard
│       ├── MetricsGrid.jsx         # Grid superior que organiza os 4 MetricCards de KPIs principais
│       ├── ProductTable.jsx        # Tabela completa de produtos (Header, Estrutura de busca e loop de ProductRows)
│       ├── Sidebar.jsx             # Barra de navegação lateral fixa (Logo, Lista de Itens e Botão de Sair)
│       ├── TopProductsSection.jsx  # Seção analítica para a listagem/destaque de produtos mais vendidos
│       └── UserTable.jsx           # Tabela completa de usuários (Header, Estrutura de busca adaptada para equivalência com colunas do Mockup e proteção de array opcional)
├── pages/                   # Componentes de nível de página que representam as telas associadas às rotas
│   ├── Home_admin.jsx       # Página do Dashboard Analítico Principal
│   ├── Produtos_Catalogo.jsx # Página de Gerenciamento de Estoque/Produtos (Listagem e Cadastro)
│   ├── Usuarios_Gestao.jsx   # Página de Gerenciamento e Cadastro de Usuários
│   └── LogEventos.jsx       # Página de Monitoramento e Auditoria de Ações do Sistema (Logs de Eventos)
├── App.jsx                  # Componente Raiz com a declaração central do Router
└── main.jsx                 # Ponto de entrada da aplicação React