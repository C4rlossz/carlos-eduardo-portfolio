# Carlos Eduardo — Portfólio

Meu portfólio pessoal com projetos, experiência profissional, formação e contato. Desenvolvido com **React, Vite, JavaScript, CSS e animações em Canvas**, com ícones Lucide e temas claro e escuro.

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
| Textos de apresentação, seções e formação | `src/main.jsx` |
| Cores, temas e layout | `src/styles.css` e `src/interactions.css` |
| Imagens do avatar | `public/avatar/` |
| Digitação e vapor do café | `src/avatarAnimation.js` |
| Animação dos números binários | `src/binaryAnimation.js` |

Para adicionar um projeto, copie um item da lista `projects` em `src/content.js`, use um `id` exclusivo e altere nome, descrição, tecnologias e links. Os campos `filters` aceitam `backend`, `cloud` e `frontend`.

Os cursos ficam nos itens `TimelineItem` em `src/main.jsx`. Para inserir um certificado, substitua `certificatePending` por `certificateUrl="URL_DO_CERTIFICADO"` no curso correspondente. Enquanto o endereço não é informado, a indicação é apenas um texto, sem link vazio.

## Publicar na Vercel

Importe este repositório e use:

- **Branch de produção:** `main`
- **Framework:** Vite
- **Instalação:** `npm ci`
- **Build:** `npm run build`
- **Diretório de saída:** `dist`

O arquivo `vercel.json` já contém as configurações de build. Depois de conectar o repositório, os commits na branch `main` atualizam o site automaticamente.

O portfólio não precisa de banco de dados nem de variáveis de ambiente.
