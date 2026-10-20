# Carlos Eduardo — Portfólio

Meu portfólio pessoal com projetos, experiência profissional, formação e contato. Desenvolvido com **React, Vite, JavaScript, CSS e animações em Canvas**, com ícones Lucide, temas claro e escuro e conteúdo em português e inglês.

## Rodar no computador

Use Node.js 22.12 ou superior.

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`. Para gerar a versão de publicação, execute `npm run build`.

## Atualizar o portfólio

| O que mudar | Arquivo |
| --- | --- |
| Projetos, experiências, tecnologias e links | `src/content.js` |
| Textos de apresentação, seções e formação (português) | `src/main.jsx` |
| Traduções para inglês | `src/translations.js` |
| Preferência de idioma, metadados e tradução | `src/i18n.jsx` |
| Cores, temas e layout | `src/styles.css` e `src/interactions.css` |
| Imagens do avatar | `public/avatar/` |
| Digitação e vapor do café | `src/avatarAnimation.js` |
| Animação dos números binários | `src/binaryAnimation.js` |

Para adicionar um projeto, copie um item da lista `projects` em `src/content.js`, use um `id` exclusivo e altere nome, descrição, tecnologias e links. Os campos `filters` aceitam `backend`, `cloud` e `frontend`.

Os cursos ficam nos itens `TimelineItem` em `src/main.jsx`. Para inserir um certificado, substitua `certificatePending` por `certificateUrl="URL_DO_CERTIFICADO"` no curso correspondente. Enquanto o endereço não é informado, a indicação é apenas um texto, sem link vazio.

## Idiomas

O botão **EN / PT** no cabeçalho alterna todo o conteúdo sem recarregar a página. O idioma escolhido fica salvo no navegador, independentemente do tema. O português é o idioma inicial.

Os textos em português são as chaves do dicionário `src/translations.js`. Ao adicionar ou alterar textos em `src/main.jsx` ou `src/content.js`, inclua a tradução correspondente nesse dicionário. Nas interfaces JSX, use `t("Texto em português")`; os dados de projetos, experiências e tecnologias são traduzidos a partir de `src/content.js`. Nomes próprios, IDs, filtros e links permanecem os mesmos.

Para verificar as duas versões e a cobertura das traduções, execute `npm run check:languages`.

## Publicar na Vercel

Importe este repositório e use:

- **Branch de produção:** `main`
- **Framework:** Vite
- **Instalação:** `npm ci`
- **Build:** `npm run build`
- **Diretório de saída:** `dist`

O arquivo `vercel.json` já contém as configurações de build. Depois de conectar o repositório, os commits na branch `main` atualizam o site automaticamente.

O portfólio não precisa de banco de dados nem de variáveis de ambiente.
