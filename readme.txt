Sistema de Gerenciamento de Chamados

Este é um aplicativo web completo para gerenciamento de chamados de suporte, construído com Next.js, React e Tailwind CSS. Ele oferece uma interface intuitiva para visualizar, criar, editar e excluir chamados, além de uma seção de relatórios com filtros avançados.

## ✨ Funcionalidades

### 🖥️ Layout e Navegação
*   **Sidebar Fixa**: Uma barra lateral de 250px de largura no lado esquerdo, com links de navegação.
*   **Área de Conteúdo Principal**: Ocupa o restante do espaço disponível, exibindo o conteúdo da página atual.
*   **Responsividade**: O layout se adapta a diferentes tamanhos de tela, com a sidebar colapsável em telas menores.
*   **Identidade Visual**: Esquema de cores consistente utilizando tons de azul.
*   **Menu de Navegação**: Links para Dashboard, Chamados e Relatórios com ícones e indicador visual da página atual.

### 📊 Dashboard
*   **Visão Geral**: Página inicial que exibe estatísticas e uma visão geral dos chamados.
*   **Cards de Estatísticas**: Total de chamados, chamados em aberto, chamados de alta prioridade e chamados resolvidos hoje.
*   **Distribuição por Prioridade**: Gráfico ou lista mostrando a proporção de chamados por prioridade (Alta, Moderada, Baixa).
*   **Chamados Recentes**: Lista dos últimos chamados abertos.

### 🎫 Tela de Listagem de Chamados
*   **Tabela Responsiva**: Exibe todos os chamados em um formato de tabela.
*   **Colunas**: Número, Prioridade, Aberto Por, Responsável, Data de Abertura e Última Atualização.
*   **Cores por Prioridade**:
    *   **ALTA**: Vermelho
    *   **MODERADA**: Amarelo
    *   **BAIXA**: Verde
*   **Ações por Linha**: Botões para **Editar** e **Excluir** cada chamado.
*   **Confirmação de Exclusão**: Modal de confirmação antes de excluir um chamado.
*   **Feedback Visual**: Toasts para sucesso ou erro nas operações.

### 📝 Formulário para Criação/Edição de Chamados
*   **Formulário Responsivo**: Layout em card centralizado, adaptável a diferentes telas.
*   **Campos**:
    *   **Prioridade**: Dropdown com opções BAIXA, MODERADA, ALTA.
    *   **Número**: Campo de texto.
    *   **Aberto Por**: Campo de texto.
    *   **Responsável**: Campo de texto.
    *   **Descrição Resumida**: Área de texto expandida.
*   **Campos Não Editáveis**: Data de Abertura e Última Atualização são gerados automaticamente.
*   **Validações Básicas**: Campos obrigatórios com feedback visual.
*   **Botões de Ação**: Salvar/Cancelar.

### 📈 Relatórios (Funcionalidade Avançada)
*   **Filtros Dinâmicos**:
    *   **Prioridade**: Filtra chamados por prioridade específica.
    *   **Responsável**: Busca chamados atribuídos a um responsável.
    *   **Aberto Por**: Busca chamados abertos por um solicitante.
    *   **Data de Abertura (Início e Fim)**: Filtra chamados dentro de um período de abertura.
*   **Cards de Resumo Filtrados**: Exibe o total de chamados filtrados e a contagem de chamados de alta e moderada prioridade dentro dos critérios aplicados.
*   **Tabela de Chamados Filtrados**: Lista os chamados que correspondem aos filtros aplicados.
*   **Limpar Filtros**: Botão para resetar todos os filtros.

### 📡 Serviço de Comunicação com a API (Mock)
*   **`useApi` Hook**: Um custom hook para centralizar todas as requisições HTTP.
*   **Dados Mock**: Utiliza dados em memória (`lib/mock-data.ts`) para simular um backend real.
*   **Operações CRUD**: Funções para `GET`, `POST`, `PUT` e `DELETE` chamados.
*   **Simulação de Latência**: Adiciona um pequeno atraso nas requisições para simular a latência de rede.
*   **Simulação de Erros**: Ocasionalmente, as requisições podem falhar para testar o tratamento de erros da aplicação.
*   **Tratamento de Erros**: Captura e exibe mensagens de erro da API.

## 🚀 Tecnologias Utilizadas
*   **Next.js 15**: Framework React para aplicações web.
*   **React**: Biblioteca JavaScript para construção de interfaces de usuário.
*   **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
*   **shadcn/ui**: Coleção de componentes UI reutilizáveis e acessíveis.
*   **TypeScript**: Linguagem que adiciona tipagem estática ao JavaScript.
*   **Lucide React**: Biblioteca de ícones.
*   **date-fns**: Biblioteca para manipulação de datas.

## ⚙️ Como Rodar o Projeto

1.  **Clone o repositório (se aplicável) ou salve os arquivos:**
    \`\`\`bash
    # Se você estiver usando o v0, pode baixar o código diretamente.
    # Caso contrário, crie um novo projeto Next.js e copie os arquivos.
    npx create-next-app@latest my-chamados-app --typescript --tailwind --eslint --app --src-dir --use-npm
    cd my-chamados-app
    \`\`\`

2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Execute o aplicativo:**
    \`\`\`bash
    npm run dev
    \`\`\`

    O aplicativo estará disponível em `http://localhost:3000`.

## 💡 Próximos Passos e Melhorias Potenciais
*   **Integração com API Real**: Substituir as funções mock por chamadas HTTP reais para um backend (ex: Node.js com Express, Python com FastAPI, etc.).
*   **Autenticação e Autorização**: Implementar um sistema de login e controle de acesso para usuários.
*   **Paginação**: Adicionar paginação na listagem de chamados para lidar com grandes volumes de dados.
*   **Busca por Texto**: Campo de busca global para pesquisar chamados por número, descrição, etc.
*   **Gráficos de Relatórios**: Integrar uma biblioteca de gráficos (ex: Recharts, Chart.js) para visualizações mais ricas na seção de relatórios.
*   **Exportação de Dados**: Funcionalidade para exportar a lista de chamados filtrados (CSV, PDF).
*   **Notificações em Tempo Real**: Usar WebSockets para notificações sobre atualizações de chamados.
*   **Testes**: Adicionar testes unitários e de integração.
