# Portfólio — Eduardo Marinho

Site pessoal para apresentar projetos, experiência profissional, formação e habilidades técnicas de forma interativa.

## Objetivo

Mostrar, de maneira clara e visual, quem eu sou e o que já construi. O projeto reúne:

- uma homepage com minha apresentação e trajetória;
- uma lista de projetos com filtros;
- páginas individuais para cada projeto;
- uma linha do tempo com experiências;
- *versão para celulares ainda em desenvolvimento.

## Stack

- **Next.js 16** com App Router
- **React 19** e **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** para animações
- **Font Awesome** para ícones
- **ESLint** para validação de código

## Experiência e conteúdo

Os textos, projetos e experiências ficam em arquivos JSON em `src/app/data/`:

- `projects.json`: projetos do carrossel e páginas de detalhe;
- `timeline-data.json`: linha do tempo da trajetória profissional;
- `experiences.json`: experiências usadas em carrosséis;
- `project-manifest.json`: imagens encontradas automaticamente para cada projeto.

As chaves desses JSONs são em inglês para manter o código consistente. Os textos exibidos são em português.

## Funcionalidades

- **Carrossel de projetos** com filtros por categoria e paginação.
- **Página de projeto** com três perspectivas: produto, técnica e pessoal (`prod`, `tec` e `pers`).
- **Link compartilhável** que abre o projeto na perspectiva escolhida usando `?pov=`.
- **Cursor personalizado** que muda de cor conforme a interação e a seção.
- **Modal de tela cheia** e tutorial de uso nas páginas de projeto.
- **Redirecionamento para `/m`** em telas pequenas.

## Estrutura

```text
src/app/
  components/   componentes visuais e interativos
  data/         conteúdo em JSON
  projects/     lista de projetos e rota dinâmica [slug]
  m/            versão mobile
scripts/        geração do manifesto de imagens
public/         imagens e arquivos estáticos
```

## Como executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Para validar o projeto:

```bash
npm run lint
npm run build
```

O comando `build` também gera novamente `src/app/data/project-manifest.json` a partir das pastas em `public/projects/`.

## Deploy

O projeto está preparado para deploy em plataformas que suportam Next.js, como a Vercel.

- Comando de build: `npm run build`
- Comando de inicialização: `npm start`
- Variáveis de ambiente: nenhuma obrigatória neste MVP.
