# Tecnologias utilizadas no desenvolvimento

O site do **Gloov Rent** é uma aplicação web estática (front-end), feita com as linguagens padrão da web, sem frameworks e sem etapa de compilação (*build*). A seguir estão as tecnologias usadas, agrupadas por função.

## 1. Linguagens

**HTML5 (HyperText Markup Language).** Linguagem de marcação que define a estrutura e o conteúdo das páginas. O projeto tem três páginas — `index.html` (página inicial), `login.html` e `cadastro.html` — escritas com elementos semânticos (`header`, `nav`, `main`, `section`, `footer`), atributos de acessibilidade (`aria-*`) e metadados para buscadores e redes sociais (Open Graph). A especificação oficial é mantida pelo WHATWG como um padrão contínuo (*Living Standard*)[^html].

**CSS3 (Cascading Style Sheets).** Linguagem de estilo que define a aparência das páginas: cores, tipografia, espaçamentos e layout. O projeto usa variáveis CSS (*custom properties*, declaradas em `:root`) para centralizar a paleta de cores e os estilos de texto do protótipo, além de Flexbox, CSS Grid e *media queries* para adaptar o layout a celulares, tablets e computadores (design responsivo). O CSS é padronizado pelo W3C[^css].

**JavaScript.** Linguagem de programação executada no navegador, responsável pela interatividade: menu do celular, formulário de reserva, validação dos formulários de login e cadastro (e-mail, CPF, idade, celular e senha), máscaras de digitação e a opção de mostrar/ocultar a senha. É usado JavaScript puro (*vanilla*), sem bibliotecas externas. A linguagem segue a especificação ECMAScript, mantida pelo comitê TC39 da Ecma International[^js].

## 2. Ferramentas de desenvolvimento

**Visual Studio Code.** Editor de código-fonte gratuito da Microsoft, usado para escrever e organizar os arquivos do projeto. A pasta `.vscode/` guarda as configurações do projeto e a extensão recomendada[^vscode].

**Live Server (extensão do VS Code).** Extensão que cria um servidor local de desenvolvimento e recarrega o navegador automaticamente a cada alteração salva. No projeto, está configurada para abrir o site em `http://127.0.0.1:5500/`[^liveserver].

**EditorConfig.** Arquivo de configuração (`.editorconfig`) que padroniza a formatação do código entre editores diferentes: codificação UTF-8, quebra de linha LF e indentação de dois espaços[^editorconfig].

**Figma.** Ferramenta de design de interfaces usada para criar o protótipo do site. As cores e estilos de texto do código (por exemplo, `--vermelho`, `--creme` e `--texto-secundario`) seguem os estilos definidos no protótipo[^figma].

## 3. Controle de versão

**Git.** Sistema de controle de versão distribuído, usado para registrar o histórico de alterações do código em *commits*[^git].

**GitHub.** Plataforma de hospedagem de repositórios Git, onde fica o repositório remoto do projeto[^github].

## 4. APIs e serviços externos

**Google Maps (mapa incorporado).** A seção "Nossa Loja" exibe a localização da loja em São José do Rio Preto por meio de um mapa do Google Maps incorporado à página com um `iframe`[^mapsembed].

**Google Maps URLs.** O botão "Como chegar" usa o formato de URL do Google Maps para abrir a rota até a loja diretamente no Google Maps, no navegador ou no aplicativo do celular[^mapsurls].

**API de back-end (prevista).** As integrações de autenticação (login), cadastro de clientes e busca de disponibilidade de scooters ainda não existem; os pontos de integração estão marcados com `TODO` no código e serão ligados a uma API quando o back-end for desenvolvido.

## 5. Recursos visuais e formatos de arquivo

**Fontes Barlow e Barlow Condensed.** Famílias tipográficas de Jeremy Tribby, distribuídas pelo Google Fonts[^barlow][^barlowcond] sob a licença SIL Open Font License 1.1[^ofl]. No projeto, as fontes ficam salvas localmente em `assets/fonts/`, o que permite que o site funcione sem depender de servidores externos.

**WOFF2 (Web Open Font Format 2.0).** Formato compactado de fonte para a web, padronizado pelo W3C, usado para os arquivos das fontes Barlow, reduzindo o tempo de carregamento[^woff2].

**WebP.** Formato de imagem desenvolvido pelo Google que oferece compressão melhor que JPEG e PNG. É usado na foto do topo (em duas resoluções, 768 px e 1440 px) e nas fotos das scooters[^webp].

**SVG (Scalable Vector Graphics).** Formato de imagem vetorial padronizado pelo W3C, usado no favicon e nos ícones da interface, que mantêm a nitidez em qualquer tamanho de tela[^svg].

---

[^html]: WHATWG. *HTML Living Standard*. Disponível em: <https://html.spec.whatwg.org/>. Acesso em: 17 nov. 2026.
[^css]: W3C. *Cascading Style Sheets*. Disponível em: <https://www.w3.org/Style/CSS/>. Acesso em: 17 nov. 2026.
[^js]: ECMA INTERNATIONAL; TC39. *ECMAScript Language Specification*. Disponível em: <https://tc39.es/ecma262/>. Acesso em: 17 nov. 2026.
[^vscode]: MICROSOFT. *Visual Studio Code*. Disponível em: <https://code.visualstudio.com/>. Acesso em: 17 nov. 2026.
[^liveserver]: DEY, Ritwick. *Live Server*. Visual Studio Marketplace. Disponível em: <https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer>. Acesso em: 17 nov. 2026.
[^editorconfig]: EDITORCONFIG. *EditorConfig*. Disponível em: <https://editorconfig.org/>. Acesso em: 17 nov. 2026.
[^figma]: FIGMA. *Figma*. Disponível em: <https://www.figma.com/>. Acesso em: 17 nov. 2026.
[^git]: GIT. *Git*. Disponível em: <https://git-scm.com/>. Acesso em: 17 nov. 2026.
[^github]: GITHUB. *GitHub*. Disponível em: <https://github.com/>. Acesso em: 17 nov. 2026.
[^mapsembed]: GOOGLE. *Maps Embed API*. Google for Developers. Disponível em: <https://developers.google.com/maps/documentation/embed/get-started>. Acesso em: 17 nov. 2026.
[^mapsurls]: GOOGLE. *Maps URLs*. Google for Developers. Disponível em: <https://developers.google.com/maps/documentation/urls/get-started>. Acesso em: 17 nov. 2026.
[^barlow]: GOOGLE FONTS. *Barlow*. Disponível em: <https://fonts.google.com/specimen/Barlow>. Acesso em: 17 nov. 2026.
[^barlowcond]: GOOGLE FONTS. *Barlow Condensed*. Disponível em: <https://fonts.google.com/specimen/Barlow+Condensed>. Acesso em: 17 nov. 2026.
[^ofl]: SIL INTERNATIONAL. *SIL Open Font License*. Disponível em: <https://openfontlicense.org/>. Acesso em: 17 nov. 2026.
[^woff2]: W3C. *WOFF File Format 2.0*. Disponível em: <https://www.w3.org/TR/WOFF2/>. Acesso em: 17 nov. 2026.
[^webp]: GOOGLE. *WebP*. Google for Developers. Disponível em: <https://developers.google.com/speed/webp>. Acesso em: 17 nov. 2026.
[^svg]: W3C. *Scalable Vector Graphics (SVG)*. Disponível em: <https://www.w3.org/Graphics/SVG/>. Acesso em: 17 nov. 2026.
