# Guia Bateria

Guia interativo em português do Brasil para revisar ajustes do iPhone que podem ajudar no uso da bateria. O conteúdo usa os nomes e caminhos do iOS 26 e muda conforme os recursos do modelo selecionado.

**[Abrir o Guia Bateria](https://guia-bateria.vercel.app)**

O projeto é independente e não possui afiliação com a Apple.

## Recursos

- 22 dicas organizadas por assunto, com 18 a 22 disponíveis conforme o aparelho.
- 31 modelos compatíveis com iOS 26, do iPhone 11 à família iPhone 17 e aos modelos SE compatíveis.
- Matriz explícita de capacidades por modelo para 5G, OLED, ProMotion, limite de quadros, Tela Sempre Ativada, limite de carregamento, menus de Bateria, Siri e outros recursos.
- Caminhos e instruções adaptados ao aparelho selecionado.
- Estados **Pendente**, **Concluída** e **Para depois**, com progresso independente por modelo.
- Persistência local, sem conta, envio de progresso ou serviço externo para consultar as dicas.
- PWA instalável, com cache offline e atualização automática.
- Interface Framework7 com tema iOS e aparência escura.
- Links para o Manual de Uso do iPhone e o Suporte da Apple em português do Brasil.

## Tecnologias

- [Framework7 9](https://framework7.io/) e Framework7 React
- React 19
- TypeScript
- Vite
- vite-plugin-pwa e Workbox
- Playwright

O Framework7 e seus ícones são dependências locais. A interface usa os componentes do framework, incluindo `Page`, `PageContent`, `Navbar`, `Block`, `List`, `ListItem`, `Button`, `Segmented`, `Progressbar`, `Icon`, `Tabs` e `Dialog`.

## Executar localmente

Requer Node.js 22 ou posterior.

```sh
git clone https://github.com/gabaweb/guia-bateria.git
cd guia-bateria
npm ci
npm run dev
```

O servidor de desenvolvimento fica disponível em `http://localhost:5173`.

Para testar o build de produção e o service worker:

```sh
npm run build
npm run preview
```

O preview fica disponível em `http://localhost:4173`. O cache offline é ativado no build de produção.

## Testes

```sh
npm test
npx playwright install chromium webkit
npm run build
npm run test:e2e
```

Os testes de dados verificam diferenças entre modelos básicos, SE e Pro. Os testes de navegador cobrem seleção do aparelho, conclusão e adiamento de dicas, persistência, troca de modelo, limpeza do progresso, atualização automática, rotas, botão Voltar, áreas seguras do iOS e funcionamento offline real em Chromium e WebKit.

## Estrutura do projeto

- `src/data/models.ts`: modelos e capacidades que determinam a compatibilidade.
- `src/data/tips.ts`: conteúdo, caminhos, passos, regras de disponibilidade e fontes.
- `src/state.tsx`: estado e persistência versionada no `localStorage`.
- `src/components/`: componentes compartilhados e integração com as rotas.
- `src/pwa.tsx`: registro, atualização e disponibilidade offline.
- `docs/compatibilidade-ios26.md`: critérios de compatibilidade e validação por modelo.
- `tests/`: testes de dados, interface, navegação e PWA.

## Conteúdo e compatibilidade

As fontes Apple em português do Brasil foram conferidas em 11 de setembro de 2026, com referência ao iOS 26. A página Sobre e cada dica oferecem links diretos às fontes utilizadas.

O conteúdo diferencia recursos como 5G, OLED, ProMotion, Tela Sempre Ativada e limite de carregamento por modelo. Quando operadora, plano, região ou versão do sistema podem afetar uma opção, a dica apresenta somente a observação necessária para localizá-la.

O guia não promete uma porcentagem de economia por ajuste. Modo Escuro é exibido nos modelos OLED pelo possível efeito na emissão de luz. Movimento e transparência são apresentados como escolhas opcionais. As opções de carregamento tratam da preservação da capacidade da bateria no longo prazo e podem reduzir a carga disponível durante o dia.

## PWA

O manifest, os ícones e o service worker são gerados durante `npm run build`. Depois do primeiro carregamento completo, a aplicação funciona sem internet; os links externos da Apple continuam dependendo de conexão.

O layout usa as áreas seguras do iOS para manter a barra de status e o indicador de rolagem fora do conteúdo. Guia, Progresso e Sobre compartilham uma página com abas roteáveis do Framework7, preservando a posição de rolagem.

## Privacidade

O Guia Bateria não usa conta, analytics ou backend. O modelo e as marcações ficam no armazenamento local do navegador. Apagar os dados do site remove essas escolhas, e não há sincronização entre dispositivos.

## Como contribuir

Issues e pull requests são bem-vindos. Ao alterar modelos, caminhos ou disponibilidade, inclua uma fonte oficial da Apple em português do Brasil e atualize os testes correspondentes.

Antes de enviar uma mudança, execute:

```sh
npm test
npm run build
npm run test:e2e
```

## Licença

Distribuído sob a [licença MIT](LICENSE). O arquivo `public/framework7-icons-LICENSE.txt` contém a licença aplicável ao desenho de ícone usado nos favicons e ícones da PWA.
