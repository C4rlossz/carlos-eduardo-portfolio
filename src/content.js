export const profile = {
  name: 'Carlos Eduardo',
  github: 'https://github.com/C4rlossz',
  linkedin: 'https://www.linkedin.com/in/carlos-eduardo-a8bb50268/',
};

export const experiences = [
  {
    id: 'luigi-store',
    company: 'Luigi Store',
    role: 'Desenvolvedor de e-commerce',
    period: '2023 — 2024',
    icon: 'code',
    summary: 'Desenvolvimento de uma loja online com um catálogo que combinava dropshipping e venda tradicional.',
    contributions: [
      'Estruturação do sistema de gestão de produtos, pedidos e contas de usuários, incluindo o acompanhamento de pedidos.',
      'Configuração dos recursos de segurança oferecidos pela plataforma para proteger informações de clientes e transações.',
      'Integração do checkout com uma solução existente para o fluxo de compra da loja.',
      'Desenvolvimento do painel administrativo para gerenciar produtos, acompanhar vendas e monitorar os fluxos financeiros.',
    ],
  },
  {
    id: 'assistencia-tecnica',
    company: 'Assistência técnica especializada',
    role: 'Técnico em computadores e servidores',
    period: 'Março de 2025 — Maio de 2026',
    icon: 'server',
    summary: 'Montagem, configuração, manutenção e suporte a computadores, notebooks e servidores.',
    contributions: [
      'Montagem e configuração completa de servidores com memória RAM na escala de terabytes, mais de 60 TB de armazenamento e arranjos RAID.',
      'Montagem de servidores e estações de trabalho para demandas institucionais, incluindo a UnB e o TSE, em Brasília.',
      'Manutenção preventiva e corretiva em computadores e notebooks, com diagnóstico e análise de circuitos em placas.',
      'Reballing em placas de vídeo e reparos com estação de retrabalho.',
      'Suporte técnico completo, da formatação e configuração do sistema ao atendimento remoto e orientação a clientes pelo AnyDesk.',
    ],
  },
];

export const projects = [
  {
    id: 'talume', number: '01', name: 'Talume', category: 'Aplicação web',
    tags: ['C#', '.NET', 'PostgreSQL', 'Docker'], filters: ['backend'],
    subtitle: 'Do primeiro orçamento à entrega.',
    description: 'Um espaço para organizar projetos, clientes, tarefas e pagamentos, com um portal para o cliente acompanhar cada etapa.',
    detail: 'Criei o Talume para aproximar o desenvolvimento de um projeto da experiência de quem o contrata. O sistema reúne a organização do trabalho e o acompanhamento pelo cliente em uma mesma aplicação.',
    contributions: ['Áreas de desenvolvedor e cliente com controle de acesso.', 'Organização de propostas, projetos, tarefas e pagamentos.', 'Convites e confirmação de e-mail com integração ao Resend.', 'Ambiente com Docker e PostgreSQL, hospedagem no Railway e DNS no Cloudflare.'],
    repo: 'https://github.com/C4rlossz/Talume', live: 'https://talume.app.br',
    note: 'Projeto pessoal em evolução. Consulte o repositório para detalhes da implementação.',
  },
  {
    id: 'talumedoc', number: '02', name: 'TalumeDoc', category: 'Cloud & processamento de dados',
    tags: ['C#', '.NET', 'AWS', 'AWS CDK'], filters: ['backend', 'cloud'],
    subtitle: 'Clareza em cada arquivo.',
    description: 'Validação de arquivos CSV em segundo plano, com identificação de registros inválidos e relatórios de erros.',
    detail: 'Uma ferramenta da família Talume para exercitar processamento assíncrono e uma arquitetura em nuvem com C# e .NET. O usuário envia um CSV de produtos, acompanha o processamento e consulta o relatório.',
    contributions: ['API e worker em C# e .NET.', 'Validação de estrutura, SKU, nome, quantidade e preço.', 'Relatórios de erros e download de CSV.', 'Infraestrutura definida com AWS CDK, incluindo Lambda, S3, DynamoDB, SQS e Cognito.'],
    repo: 'https://github.com/C4rlossz/TalumeDoc',
    note: 'Implementação e testes locais disponíveis. A implantação e a validação em uma conta AWS são etapas previstas na documentação.',
  },
  {
    id: 'students', number: '03', name: 'Student Management', category: 'Cadastro & banco de dados',
    tags: ['Azure', 'Docker', 'SQL', 'Banco de dados'], filters: ['cloud'],
    subtitle: 'Uma base para aprender construindo.',
    description: 'Um dos meus primeiros projetos: organização de estudantes e cursos, com foco em dados, containerização e ambiente em nuvem.',
    detail: 'Desenvolvido em 2023, o projeto de registro de estudantes foi uma oportunidade de aprofundar meus estudos sobre computação em nuvem, portabilidade de aplicações e gerenciamento de dados.',
    contributions: ['Modelagem dos dados de estudantes e cursos.', 'Configuração de ambiente no Azure para hospedagem.', 'Uso de Docker para facilitar a portabilidade e a replicação do ambiente.', 'Código disponível no GitHub para consulta e evolução.'],
    repo: 'https://github.com/C4rlossz/Student-Management-System',
    note: 'Projeto de aprendizado desenvolvido em 2023.',
  },
];

projects.push(
  {
    id: 'kanban', number: '04', name: 'ProjectKanban', category: 'Organização de tarefas & .NET',
    tags: ['C#', 'ASP.NET MVC', 'EF Core', 'SQL Server'], filters: ['backend'],
    subtitle: 'Cada tarefa no seu momento.',
    description: 'Quadro de atividades com etapas de pendente, em andamento e finalizada, desenvolvido com ASP.NET MVC.',
    detail: 'Um projeto de estudo que conecta uma interface em Razor ao gerenciamento de atividades em C#. O quadro organiza o trabalho em três estados e permite acompanhar a evolução de cada tarefa.',
    contributions: ['Cadastro de atividades com título, descrição e status.', 'Avanço e retorno de cartões entre as etapas do quadro.', 'Consultas e persistência de dados com Entity Framework Core.', 'Estrutura com controllers, serviços, DTOs e banco SQL Server.'],
    repo: 'https://github.com/C4rlossz/ProjectKanban',
    note: 'Projeto de estudo. Funcionalidades e tecnologias conferidas no código do repositório; não é apresentado como serviço publicado.',
  },
  {
    id: 'finance', number: '05', name: 'Controle Financeiro', category: 'Interface & organização pessoal',
    tags: ['React', 'JavaScript', 'Hooks', 'localStorage'], filters: ['frontend'],
    subtitle: 'Entradas, saídas e uma visão do saldo.',
    description: 'Aplicação em React para registrar movimentações e acompanhar entradas, despesas e saldo, com dados salvos no navegador.',
    detail: 'Uma experiência prática de frontend com componentes React e gerenciamento de estado. A aplicação calcula os totais a partir das transações e mantém os registros localmente entre acessos.',
    contributions: ['Formulário para cadastrar entradas e saídas.', 'Resumo de receitas, despesas e saldo.', 'Cálculo dos totais com hooks e operações sobre as transações.', 'Persistência das movimentações com localStorage.'],
    repo: 'https://github.com/C4rlossz/Controle-Financeiro',
    note: 'Projeto de estudo com armazenamento local no navegador. Os valores do card são apenas demonstrativos.',
  },
);

export const skills = [
  { title: 'Backend & arquitetura', icon: 'code', label: 'Meu foco principal', items: ['C#', '.NET', 'APIs', 'Testes unitários', 'SOLID', 'Clean Code', 'MVVM'] },
  { title: 'Cloud & dados', icon: 'cloud', label: 'Da aplicação à infraestrutura', items: ['Docker', 'AWS', 'Azure', 'SQL', 'PostgreSQL', 'NoSQL', 'Supabase', 'Azure Data Studio'] },
  { title: 'Ferramentas & processos', icon: 'workflow', label: 'Como organizo o trabalho', items: ['Git & GitHub', 'Scrum', 'Agile', 'Trello', 'Jira', 'Notion', 'Windows', 'Linux'] },
];
