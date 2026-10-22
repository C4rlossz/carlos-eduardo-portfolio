import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Render the real React components in both languages, without a browser or a test dependency.
const vite = await createServer({ server: { middlewareMode: true, watch: null }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
try {
  const [{ default: App, ProjectDialog }, { default: Avatar }, i18n, content, { english }] = await Promise.all([
    vite.ssrLoadModule('/src/main.jsx'), vite.ssrLoadModule('/src/avatar.jsx'),
    vite.ssrLoadModule('/src/i18n.jsx'), vite.ssrLoadModule('/src/content.js'),
    vite.ssrLoadModule('/src/translations.js'),
  ]);
  const { LanguageProvider, readLanguage, localizeContent, applyLanguage } = i18n;
  const stored = new Map();
  const metadata = new Map();
  globalThis.localStorage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) };
  globalThis.document = {
    documentElement: { dataset: { theme: 'dark' } },
    querySelector: selector => ({ setAttribute: (_, value) => metadata.set(selector, value) }),
  };
  globalThis.matchMedia = () => ({ matches: false });
  const render = component => renderToStaticMarkup(React.createElement(LanguageProvider, null, component));
  const text = markup => markup.replace(/<[^>]*>/g, '').replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
  const requireTranslation = source => assert(Object.hasOwn(english, source) && english[source], `Missing English translation: ${source}`);

  // Ensure every descriptive data field, including modal-only text, has a translation.
  for (const project of content.projects) {
    for (const key of ['category', 'subtitle', 'description', 'detail', 'note']) requireTranslation(project[key]);
    project.contributions.forEach(requireTranslation);
  }
  for (const experience of content.experiences) {
    for (const key of ['role', 'summary']) requireTranslation(experience[key]);
    experience.contributions.forEach(requireTranslation);
  }
  for (const group of content.skills) [group.title, group.label].forEach(requireTranslation);
  for (const file of ['src/main.jsx', 'src/MobilePreview.jsx', 'src/avatar.jsx', 'src/i18n.jsx']) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    for (const match of source.matchAll(/\bt\((['"])((?:\\.|(?!\1).)*)\1\)/g)) requireTranslation(match[2]);
  }
  assert.equal(readLanguage(), 'pt');
  stored.set('carlos-language', 'invalid');
  assert.equal(readLanguage(), 'pt');
  for (const language of ['pt', 'en']) {
    applyLanguage(language);
    assert.equal(readLanguage(), language);
    assert.equal(document.documentElement.lang, language === 'en' ? 'en' : 'pt-BR');
    assert.equal(document.documentElement.dataset.theme, 'dark');
    assert.equal(document.title, language === 'en' ? 'Carlos Eduardo | C# and .NET Developer' : 'Carlos Eduardo | Desenvolvedor C# e .NET');
    assert.equal(metadata.get('meta[property="og:title"]'), document.title);
    assert(metadata.get('meta[name="description"]').includes(language === 'en' ? 'Explore my projects' : 'Conheça meus projetos'));
    const page = render(React.createElement(App));
    const copy = text(page);
    assert(copy.includes(language === 'en' ? 'SELECTED PROJECTS' : 'PROJETOS SELECIONADOS'));
    assert(copy.includes(language === 'en' ? 'Introduction to Cybersecurity' : 'Introdução à Cibersegurança'));
    assert(copy.includes(language === 'en' ? 'Networking Basics' : 'Conceitos Básicos de Rede'));
    assert(copy.includes(language === 'en' ? 'Not completed' : 'Não concluído'));
    assert(page.includes(language === 'en' ? 'Switch to Portuguese' : 'Mudar para inglês'));
    assert(page.includes('href="#experiencia"'));
    assert.equal((page.match(/class="project-detail"/g) || []).length, content.projects.length);
    assert(copy.includes('Mobile & Android'));
    assert(copy.includes('Talumi'));
    assert(copy.includes('CoffeeDev'));
    assert.equal((page.match(/class="android-phone"/g) || []).length, 2);
    const mobile = content.projects.filter(project => project.filters.includes('mobile'));
    assert.deepEqual(mobile.map(project => project.repo), ['https://github.com/C4rlossz/Talumi', 'https://github.com/C4rlossz/CoffeeDev']);
    const localized = localizeContent(content.projects, language);
    for (let index = 0; index < localized.length; index++) {
      const project = localized[index];
      assert.equal(project.repo, content.projects[index].repo);
      assert.deepEqual(project.filters, content.projects[index].filters);
      const modal = render(React.createElement(ProjectDialog, { project, onClose: () => {} }));
      assert(text(modal).includes(language === 'en' ? 'What I built' : 'O que desenvolvi'));
      assert(modal.includes(project.repo));
      assert(text(modal).includes(project.detail));
    }
    for (const theme of ['dark', 'light']) {
      const avatar = render(React.createElement(Avatar, { theme, reduced: false }));
      assert(avatar.includes(language === 'en' ? (theme === 'dark' ? 'Screen on' : 'Screen off') : (theme === 'dark' ? 'Tela ligada' : 'Tela desligada')));
    }
    if (language === 'en') {
      // No translated Portuguese phrases may remain in visible page copy.
      for (const [portuguese, translated] of Object.entries(english)) {
        if (portuguese !== translated && portuguese.length > 20) assert(!copy.includes(portuguese), `Portuguese text remains: ${portuguese}`);
      }
    }
    console.log(`${language.toUpperCase()}: page, ${content.projects.length} project dialogs, Android previews, courses and avatar labels verified`);
  }
  globalThis.localStorage = {
    getItem: () => { throw new Error('Storage blocked'); },
    setItem: () => { throw new Error('Storage blocked'); },
  };
  assert.equal(readLanguage(), 'pt');
  assert.doesNotThrow(() => applyLanguage('en'));
  console.log('Translation coverage, saved preference, metadata and blocked-storage fallback verified');
} finally {
  await vite.close();
}
