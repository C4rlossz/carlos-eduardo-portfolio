import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Moon, Sun, Github, Linkedin, Menu, X, Code2, Cloud, Workflow, Database, Layers, Terminal, FileCheck2, ExternalLink, Check, Mouse, ChevronDown, Server } from 'lucide-react';
import { profile, projects, skills, experiences } from './content';
import BinaryBackground from './BinaryBackground';
import './styles.css';
import './interactions.css';

const DeveloperScene = lazy(() => import('./avatar.jsx'));
const icons = { code: Code2, cloud: Cloud, workflow: Workflow, server: Server };
const navItems = [['sobre', 'Sobre'], ['projetos', 'Projetos'], ['stack', 'Stack'], ['experiencia', 'Experiência'], ['trajetoria', 'Formação']];

function useMotionPreference() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

function App() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const progressRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const reduced = useMotionPreference();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0b0d0b' : '#f0f2ec';
    try { localStorage.setItem('carlos-theme', theme); } catch {}
  }, [theme]);

  useEffect(() => {
    const reveal = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); reveal.unobserve(e.target); }
    }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
    const sections = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) setActive(e.target.id);
    }), { rootMargin: '-20% 0px -60% 0px' });
    document.querySelectorAll('section[id]').forEach(el => sections.observe(el));
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const height = document.documentElement.scrollHeight - innerHeight;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${height > 0 ? Math.min(1, scrollY / height) : 0})`;
        frame = 0;
      });
    };
    window.addEventListener('scroll', update, { passive: true }); update();
    return () => { reveal.disconnect(); sections.disconnect(); window.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (selected && dialogRef.current) {
      dialogRef.current.showModal();
      const oldOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = oldOverflow; };
    }
  }, [selected]);

  const closeProject = () => { dialogRef.current?.close(); setSelected(null); triggerRef.current?.focus(); };
  const openProject = (project, event) => { triggerRef.current = event.currentTarget; setSelected(project); };
  const goTo = () => setMenuOpen(false);
  const visibleProjects = projects.filter(p => filter === 'all' || p.filters.includes(filter));
  const trackSurface = event => {
    if (reduced || event.pointerType === 'touch') return;
    const surface = event.currentTarget;
    const box = surface.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    surface.style.setProperty('--pointer-x', `${x * 100}%`);
    surface.style.setProperty('--pointer-y', `${y * 100}%`);
    surface.style.setProperty('--tilt-x', `${(0.5 - y) * 2.5}deg`);
    surface.style.setProperty('--tilt-y', `${(x - 0.5) * 3}deg`);
  };
  const resetSurface = event => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return <>
    <a className="skip-link" href="#main">Pular para o conteúdo</a>
    <div className="scroll-progress" ref={progressRef} style={{ transform: 'scaleX(0)' }} />
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Carlos Eduardo, início" onClick={goTo}><span className="brand-symbol">c<span>e</span><i /></span><span className="brand-word">Carlos Eduardo<span>DESENVOLVEDOR</span></span></a>
      <nav aria-label="Navegação principal" className={menuOpen ? 'navigation open' : 'navigation'} id="main-nav">
        {navItems.map(([id, label]) => <a key={id} href={`#${id}`} onClick={goTo} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
        <a className="nav-contact" href="#contato" onClick={goTo}>Vamos conversar</a>
      </nav>
      <div className="header-controls">
        <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`} title={`Tema ${theme === 'dark' ? 'claro' : 'escuro'}`}>
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button className="mobile-toggle" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>

    <main id="main">
      <section className="hero" id="inicio">
        <BinaryBackground theme={theme} reduced={reduced} />
        <div className="hero-content">
          <div className="eyebrow hero-eyebrow"><span className="tiny-line" /> DESENVOLVIMENTO · CLOUD · DADOS</div>
          <h1>Carlos<br /><span>Eduardo<span className="name-dot">.</span></span></h1>
          <div className="hero-role"><span className="code-bracket">&lt;</span> Desenvolvedor C# & .NET <span className="code-bracket">/&gt;</span></div>
          <p>Transformo ideias em sistemas.<br />Do código à nuvem, com atenção a cada detalhe.</p>
          <div className="hero-actions"><a className="button primary" href="#projetos">Conheça meus projetos <Layers size={18} /></a><a className="icon-link" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub de Carlos Eduardo"><Github size={21} /></a><a className="icon-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Carlos Eduardo"><Linkedin size={21} /></a></div>
          <div className="hero-small"><span className="mono">01 /</span> Código com propósito. Aprendizado constante.</div>
        </div>
        <div className="scene-area" data-screen={theme === 'dark' ? 'on' : 'off'}>
          <div className="scene-orbit orbit-one" /><div className="scene-orbit orbit-two" />
          <span className="scene-coordinate top-coordinate">CE / WORKSPACE</span>
          <div className="scene-stage"><Suspense fallback={<div className="scene-loading"><Terminal size={36} /><span>Preparando o workspace…</span></div>}><DeveloperScene theme={theme} reduced={reduced} /></Suspense></div>
          <div className="scene-chip chip-code"><Code2 size={18} /><span>C# & .NET</span></div>
          <div className="scene-chip chip-cloud"><Cloud size={18} /><span>Cloud native</span></div>
          <div className="scene-caption"><span className="mono">carlos.workspace</span><span className="scene-hint"><Mouse size={14} /> explore com o mouse</span></div>
        </div>
        <a className="scroll-cue" href="#sobre"><span>Continue explorando</span><ChevronDown size={17} /></a>
        <div className="hero-footer"><span>DESENVOLVIDO POR CARLOS EDUARDO</span><span className="mono">PORTFÓLIO / 2026</span></div>
      </section>

      <section className="about section-pad" id="sobre">
        <div className="section-heading reveal"><span className="section-index">01 — SOBRE MIM</span><span className="section-note">PESSOA ANTES DO CÓDIGO</span></div>
        <div className="about-grid">
          <h2 className="reveal">Curiosidade é<br />o meu ponto<br /><em>de partida.</em></h2>
          <div className="about-body reveal"><p className="large-body">Sou Carlos, desenvolvedor formado em Gestão de Tecnologia da Informação, com experiência em <strong>C# e .NET</strong>.</p><p>Minha trajetória passa pelo desenvolvimento e manutenção de APIs, containerização com Docker, gerenciamento de bancos de dados e configuração de ambientes em nuvem. Gosto de entender como cada parte de um sistema se conecta — e de construir soluções que façam sentido para quem as utiliza.</p><p>Também tenho conhecimentos em redes e administração de ambientes Windows e Linux. Hoje, aprofundo meus estudos em cloud, dados e ferramentas de inteligência artificial aplicadas ao desenvolvimento.</p><div className="about-signature"><span>Carlos Eduardo</span><span className="mono">const curiosity = true;</span></div></div>
        </div>
        <div className="focus-grid reveal"><div><Code2 /><h3>Construir</h3><p>APIs e sistemas com código organizado e responsabilidades claras.</p></div><div><Cloud /><h3>Conectar</h3><p>Aplicações, infraestrutura e dados trabalhando em conjunto.</p></div><div><Terminal /><h3>Evoluir</h3><p>Novas ferramentas, testes e aprendizado em projetos reais.</p></div></div>
      </section>

      <section className="projects-section section-pad" id="projetos">
        <div className="section-heading reveal"><span className="section-index">02 — PROJETOS SELECIONADOS</span><a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={17} /> Mais no GitHub</a></div>
        <div className="projects-intro reveal"><h2>Ideias que viraram <em>código.</em></h2><p>Cada projeto é uma oportunidade de resolver um problema e aprender algo novo.</p></div>
        <div className="project-filters reveal" role="group" aria-label="Filtrar projetos">{[['all', 'Todos'], ['backend', 'Backend & .NET'], ['cloud', 'Cloud & dados'], ['frontend', 'Frontend']].map(([key, name]) => <button key={key} aria-pressed={filter === key} className={filter === key ? 'selected' : ''} onClick={() => setFilter(key)}>{name}</button>)}</div>
        <div className="project-grid">
          {visibleProjects.map(p => <article key={p.id} className={`project-card interactive-surface ${p.id === 'talume' && filter === 'all' ? 'featured' : ''}`} onPointerMove={trackSurface} onPointerLeave={resetSurface}>
            <div className={`project-preview preview-${p.id}`} aria-label={`Ilustração da interface de ${p.name}`}>
              {p.id === 'talume' ? <TalumePreview /> : p.id === 'talumedoc' ? <DocPreview /> : p.id === 'kanban' ? <KanbanPreview /> : p.id === 'finance' ? <FinancePreview /> : <StudentPreview />}
              <span className="preview-label">CONCEITO DE INTERFACE</span>
            </div>
            <div className="project-info"><div className="project-topline"><span>{p.category}</span><span className="mono">/{p.number}</span></div><h3>{p.name}<span className="project-period">.</span></h3><p>{p.description}</p><div className="tag-row">{p.tags.map(t => <span key={t}>{t}</span>)}</div><button className="project-detail" onClick={e => openProject(p, e)}>Explorar projeto <ExternalLink size={17} /></button></div>
          </article>)}
        </div>
      </section>

      <section className="stack-section section-pad" id="stack">
        <div className="section-heading reveal"><span className="section-index">03 — FERRAMENTAS & CONHECIMENTOS</span><span className="section-note">O QUE ESTÁ NO MEU WORKSPACE</span></div>
        <div className="stack-intro reveal"><h2>Uma base sólida.<br /><em>Sempre em expansão.</em></h2><p>Meu foco é o ecossistema .NET. Ao redor dele, conecto ferramentas de dados, infraestrutura e organização.</p></div>
        <div className="skills-grid">{skills.map((group, i) => { const Icon = icons[group.icon]; return <article className="skill-card reveal" key={group.title} style={{ '--delay': `${i * 75}ms` }}><div className="skill-icon"><Icon size={25} /></div><span className="skill-label">{group.label}</span><h3>{group.title}</h3><div className="skill-tags">{group.items.map(item => <span key={item}>{item}</span>)}</div></article>; })}</div>
        <div className="learning-strip reveal"><span className="learning-symbol">✳</span><div><span className="eyebrow">NO RADAR / APRENDIZADO CONTÍNUO</span><p>Engenharia de dados, Azure Data Factory, AWS Glue e ETL. Ferramentas de IA, Codex e fluxos de desenvolvimento com plugins.</p></div></div>
      </section>

      <section className="experience-section section-pad" id="experiencia" aria-labelledby="experience-title">
        <div className="section-heading reveal"><span className="section-index">04 — EXPERIÊNCIA PROFISSIONAL</span><span className="section-note">SISTEMAS & INFRAESTRUTURA</span></div>
        <div className="experience-intro reveal"><h2 id="experience-title">Experiência<br /><em>na prática.</em></h2><p>Do desenvolvimento de uma loja online à montagem de servidores, uma trajetória que conecta software, hardware e suporte.</p></div>
        <div className="experience-grid">{experiences.map(experience => {
          const Icon = icons[experience.icon];
          return <article className="experience-card reveal" key={experience.id} aria-labelledby={`${experience.id}-title`}>
            <div className="experience-meta"><span className="experience-icon" aria-hidden="true"><Icon size={23} /></span><span className="experience-period">{experience.period}</span></div>
            <span className="experience-company">{experience.company}</span>
            <h3 id={`${experience.id}-title`}>{experience.role}</h3>
            <p className="experience-summary">{experience.summary}</p>
            <ul className="experience-contributions">{experience.contributions.map(item => <li key={item}>{item}</li>)}</ul>
          </article>;
        })}</div>
      </section>

      <section className="journey section-pad" id="trajetoria">
        <div className="section-heading reveal"><span className="section-index">05 — FORMAÇÃO & ESTUDOS</span><span className="section-note">APRENDER. APLICAR. REPETIR.</span></div>
        <div className="journey-grid"><div className="journey-title reveal"><h2>O caminho<br /><em>até aqui.</em></h2><p>Minha formação em tecnologia e os estudos que continuo levando para os projetos.</p></div><div className="timeline">
          <TimelineItem time="2022 — 2023" title="Gestão de Tecnologia da Informação" org="Ensino superior · Tecnólogo" badge="Concluído">Uma formação de dois anos que construiu minha base em tecnologia, sistemas e gestão.</TimelineItem>
          <TimelineItem time="2023" title="Introdução à Cibersegurança" org="Cisco Networking Academy" badge="Concluído" certificatePending>Curso de introdução à cibersegurança concluído em 2023, com certificado.</TimelineItem>
          <TimelineItem time="2023" title="Ethical Hacker" org="Cisco Networking Academy" badge="Não concluído">Estudos de hacking ético e segurança cibernética.</TimelineItem>
          <TimelineItem time="2023" title="English for IT 1" org="OpenEDG · Cisco Networking Academy" badge="Não concluído">Estudos de inglês aplicado à tecnologia da informação e à comunicação em ambientes de TI.</TimelineItem>
          <TimelineItem time="2023" title="Conceitos Básicos de Rede" org="Cisco Networking Academy" badge="Não concluído">Curso de fundamentos de redes, parte da trilha de carreira de Técnico de Rede.</TimelineItem>
          <TimelineItem time="2023" title="SQL Database" org="Udemy" badge="Concluído">Estudos em bancos de dados SQL e aplicação dos conhecimentos em projetos de cadastro e gerenciamento de informações.</TimelineItem>
          <TimelineItem time="2024 — 2025" title=".NET Backend Developer" org="Balta.io" badge="Não concluído">Trilha de estudos em desenvolvimento backend com C# e .NET.</TimelineItem>
          <TimelineItem time="AGORA" title="Cloud, dados & inteligência artificial" org="Especialização e projetos pessoais">Aprofundamento em computação em nuvem, fluxos de dados e ferramentas de IA para apoiar o desenvolvimento e a evolução dos meus projetos.</TimelineItem>
        </div></div>
      </section>

      <section className="contact section-pad" id="contato"><div className="contact-inner reveal"><span className="section-index">06 — PRÓXIMA CONVERSA</span><h2>Uma ideia.<br />Uma oportunidade.<br /><em>Vamos conversar.</em></h2><div className="contact-bottom"><p>Se você procura alguém para construir,<br />colaborar ou trocar ideias sobre tecnologia,<br />me encontre por aqui.</p><div className="contact-links"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="button primary"><Linkedin size={20} /> Conversar no LinkedIn</a><a href={profile.github} target="_blank" rel="noopener noreferrer" className="button secondary"><Github size={20} /> Explorar meu GitHub</a></div></div></div><span className="contact-art" aria-hidden="true">&lt;/&gt;</span></section>
    </main>
    <footer className="site-footer"><a className="footer-brand" href="#inicio">carlos<span>.dev</span></a><p>© {new Date().getFullYear()} Carlos Eduardo</p><span>Feito com código e curiosidade.</span></footer>

    {selected && <dialog ref={dialogRef} className="project-modal" onCancel={e => { e.preventDefault(); closeProject(); }} onClick={e => { if (e.target === e.currentTarget) closeProject(); }} aria-labelledby="project-modal-title"><div className="modal-content"><button className="modal-close" onClick={closeProject} aria-label="Fechar projeto"><X size={23} /></button><span className="eyebrow">PROJETO / {selected.number}</span><h2 id="project-modal-title">{selected.name}<span>.</span></h2><p className="modal-subtitle">{selected.subtitle}</p><p>{selected.detail}</p><h3>O que desenvolvi</h3><ul>{selected.contributions.map(item => <li key={item}><Check size={17} /><span>{item}</span></li>)}</ul><div className="tag-row">{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div><p className="project-note">{selected.note}</p><div className="modal-links"><a className="button primary" href={selected.repo} target="_blank" rel="noopener noreferrer"><Github size={18} /> Ver repositório</a>{selected.live && <a className="button secondary" href={selected.live} target="_blank" rel="noopener noreferrer"><ExternalLink size={18} /> Abrir aplicação</a>}</div></div></dialog>}
  </>;
}

function TimelineItem({ time, title, org, badge, certificateUrl, certificatePending = false, children }) {
  return <article className="timeline-item reveal">
    <span className="timeline-point" />
    <span className="mono timeline-time">{time}</span>
    <div className="timeline-top"><h3>{title}</h3>{badge && <span className="timeline-badge">{badge}</span>}</div>
    <span className="timeline-org">{org}</span>
    <p>{children}</p>
    {certificateUrl ? <a className="timeline-certificate" href={certificateUrl} target="_blank" rel="noopener noreferrer"><FileCheck2 size={15} aria-hidden="true" /><span>Ver certificado</span><ExternalLink size={13} aria-hidden="true" /></a> : certificatePending ? <span className="timeline-certificate is-pending"><FileCheck2 size={15} aria-hidden="true" /><span>Certificado · link em breve</span></span> : null}
  </article>;
}

function TalumePreview() {
  return <div className="talume-demo"><aside><b><Layers size={17} /> talume</b><span className="demo-active">Visão geral</span><span>Projetos</span><span>Clientes</span><span>Pagamentos</span><small>Workspace</small></aside><div className="demo-main"><div className="demo-top"><span>Meu workspace</span><span>CE</span></div><h4>Do plano à entrega.</h4><div className="demo-stats"><div><small>PROJETOS</small><b>03</b></div><div><small>EM ANDAMENTO</small><b>02</b></div><div><small>CONCLUÍDOS</small><b>01</b></div></div><div className="demo-project"><span className="demo-project-icon"><Code2 size={15} /></span><div><b>Website institucional</b><span>Desenvolvimento</span></div><span className="demo-percent">68%</span></div><div className="demo-bar"><i /></div><div className="demo-task"><span /><span>Definir estrutura das páginas</span><Check size={13} /></div><div className="demo-task"><span /><span>Desenvolver interface responsiva</span></div></div></div>;
}

function DocPreview() {
  return <div className="doc-demo"><div className="doc-demo-header"><FileCheck2 size={18} /><b>TalumeDoc</b><span>PROCESSAMENTO</span></div><div className="doc-file"><div className="file-icon"><span>CSV</span></div><div><b>produtos.csv</b><span>Análise concluída</span></div><div className="doc-check"><Check size={19} /></div></div><div className="doc-results"><div><span className="result-number">03</span><span>Válidos</span></div><div><span className="result-number muted-number">03</span><span>Para revisar</span></div></div><div className="doc-console"><span><i /> worker.completed</span><span>Relatório de validação disponível</span></div></div>;
}

function StudentPreview() {
  return <div className="student-demo"><div className="student-header"><Database size={18} /><span>student_management</span><span className="sql-pill">SQL</span></div><div className="code-view"><div><span className="line-number">01</span><span><i>SELECT</i> estudante.nome,</span></div><div><span className="line-number">02</span><span>       curso.titulo</span></div><div><span className="line-number">03</span><span><i>FROM</i> estudantes</span></div><div><span className="line-number">04</span><span><i>JOIN</i> cursos</span></div><div><span className="line-number">05</span><span>  <i>ON</i> curso_id = cursos.id;</span></div></div><div className="student-footer"><span><Database size={13} /> Base estruturada</span><span><Cloud size={13} /> Azure + Docker</span></div></div>;
}

function KanbanPreview() {
  return <div className="kanban-demo"><div className="mini-demo-title"><Workflow size={18} /><b>ProjectKanban</b></div><div className="kanban-columns">{[['Pendente', 'Planejar API', 'Organizar dados'], ['Em andamento', 'Construir interface'], ['Finalizada', 'Definir estrutura']].map(([name, ...tasks]) => <div key={name}><span>{name}</span>{tasks.map(task => <div className="kanban-task" key={task}><i /><b>{task}</b><small>Desenvolvimento</small></div>)}</div>)}</div><span className="mini-demo-footnote">Da ideia à tarefa concluída.</span></div>;
}

function FinancePreview() {
  return <div className="finance-demo"><div className="mini-demo-title"><Database size={18} /><b>Controle Financeiro</b></div><div className="finance-stats"><div><small>ENTRADAS</small><b>R$ 2.400</b></div><div><small>SAÍDAS</small><b>R$ 850</b></div><div><small>SALDO</small><b>R$ 1.550</b></div></div><div className="finance-row"><span>Projeto</span><b className="income">+ R$ 2.400</b></div><div className="finance-row"><span>Despesas</span><b>− R$ 850</b></div><span className="mini-demo-footnote">Exemplo com dados de demonstração.</span></div>;
}

createRoot(document.getElementById('root')).render(<App />);
