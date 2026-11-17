# Gloov Rent — landing page

Landing page do **Gloov Rent**, aluguel de scooters elétricas em São José do Rio Preto (SP).
Feita em HTML, CSS e JavaScript puros, sem dependências nem etapa de build.

## Como rodar (Live Server)

1. Abra a pasta do projeto no **VS Code**.
2. Instale a extensão **Live Server** (o VS Code sugere automaticamente — `ritwickdey.LiveServer`).
3. Clique com o botão direito em `index.html` → **Open with Live Server**
   (ou clique em **Go Live** na barra inferior).
4. A página abre em `http://127.0.0.1:5500/`.

As fontes e imagens são locais, então o site funciona offline. Só o mapa da seção "Nossa Loja" (Google Maps) precisa de internet.

## Estrutura

```
gloov-rent-site/
├─ index.html                 landing page com todas as seções
├─ login.html                 tela de login (Entrar)
├─ cadastro.html              tela de cadastro (Cadastre-se)
├─ assets/
│  ├─ css/
│  │  ├─ fonts.css            @font-face das fontes locais
│  │  └─ styles.css           estilos; cores e tipografia em variáveis (:root)
│  ├─ js/
│  │  ├─ main.js              menu do celular, formulário de reserva, link ativo do menu
│  │  ├─ login.js             validação do login (e-mail ou CPF), mostrar senha
│  │  └─ cadastro.js          validação do cadastro (CPF, idade, celular, senha), máscaras
│  ├─ img/                    logo, favicon, foto do topo (768 e 1440 px) e fotos das scooters (WebP)
│  └─ fonts/                  Barlow e Barlow Condensed (woff2, subconjunto latin)
├─ .vscode/                   configuração do Live Server (porta 5500) e extensão recomendada
├─ .editorconfig
├─ .gitattributes
└─ .gitignore
```

## Seções

Cabeçalho · Início (com formulário de reserva) · Preços · Como funciona · Vantagens · Scooters · Depoimentos · Nossa Loja · Perguntas frequentes · Cadastre-se · Rodapé

As cores e estilos de texto seguem os estilos do protótipo no Figma (por exemplo, `--vermelho`, `--creme` e `--texto-secundario`).

## Responsivo

| Largura | Comportamento |
|---|---|
| acima de 960 px | menu completo |
| até 960 px | menu vira botão ☰ |
| até 1080 px | formulário em 2 colunas |
| até 767 px | formulário e preços em 1 coluna |
| até 1000 / 680 px | cards de scooter em 2 / 1 coluna |

## Pendências (procure por `TODO` no código)

| Onde | O que falta |
|---|---|
| Cards das scooters | Autonomia real (hoje "XX km") |
| Depoimentos | Textos e nomes de clientes reais |
| Rodapé e FAQ | WhatsApp, e-mail, Instagram, Facebook e CNPJ reais |
| Nossa Loja | Link do "Site da loja" |
| Login | Ligar à API de autenticação e criar `recuperar-senha.html` |
| Cadastro | Ligar à API de cadastro |
| Links | `modelos.html`, `termos.html`, `privacidade.html` |
| Formulário | Ligar à busca de disponibilidade (hoje valida as datas e rola até os modelos) |

## Créditos

Fontes [Barlow](https://fonts.google.com/specimen/Barlow) e [Barlow Condensed](https://fonts.google.com/specimen/Barlow+Condensed), de Jeremy Tribby, sob a licença SIL Open Font License 1.1.
