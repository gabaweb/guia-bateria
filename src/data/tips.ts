import type { SettingsIcon } from "./icons";
import { chargingPath, siriPath, type Model } from "./models";
export const apple = (id: string) => `https://support.apple.com/pt-br/${id}`;
export const manual = (id: string) => apple(`guide/iphone/${id}/ios`);
export const categories = [
  { id: "start", name: "Comece por aqui", icon: "general" },
  { id: "display", name: "Tela e aparência", icon: "display" },
  { id: "apps", name: "Apps e atividade", icon: "apps" },
  { id: "network", name: "Conexões", icon: "wifi" },
  {
    id: "care",
    name: "Cuidados com a bateria",
    icon: "battery",
  },
] as const;
export type Category = (typeof categories)[number]["id"];
export type Content = {
  path: string[];
  steps: string[];
  note: string;
  extra?: { title: string; path: string[]; text: string };
};
export type Tip = {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  icon: SettingsIcon;
  description: string;
  available?: (m: Model) => boolean;
  content: (m: Model) => Content;
  sources: { name: string; url: string }[];
};
// Navigation is explicit: only screens belong here, never toggle controls.
const openSettings = (...screens: string[]) => [
  "Abra o app **Ajustes** no iPhone.",
  ...screens.map((screen) => `Toque em **${screen}**.`),
];
const openControlCenter = (m: Model) => m.homeButton
  ? "Deslize da **borda inferior da tela para cima** para abrir a **Central de Controle**."
  : "Deslize do **canto superior direito da tela para baixo** para abrir a **Central de Controle**.";
const source = (name: string, url: string) => [{ name, url }];
const fixed =
  (path: string[], steps: string[], note: string, extra?: Content["extra"]) =>
  () => ({ path, steps, note, extra });
export const tips: Tip[] = [
  {
    id: "sugestoes",
    title: "Sugestões do iOS",
    subtitle: "Entenda o que está consumindo bateria",
    category: "start",
    icon: "battery",
    description:
      "Comece pelo uso real do seu iPhone. O iOS reúne o consumo de apps e atividades do sistema e mostra sugestões quando encontra oportunidades de economia.",
    content: (m) => ({
      path: ["Ajustes", "Bateria"],
      steps: [
        ...openSettings("Bateria"),
        "Confira **Uso Diário** para comparar o consumo. Para consultar outros dias, toque em **Ver Todo o Uso da Bateria** e selecione um dia do gráfico.",
        "Role até as informações de uso de **apps e atividades do sistema**. Toque nos apps que mais consumiram para entender como a bateria foi usada.",
        "Procure **Atividade em 2º Plano**. Confira se o consumo corresponde a algo que você deixou funcionando, como música ou navegação.",
        "Volte à tela **Bateria**, role até o início e leia as **ideias e sugestões** acima de Uso Diário. Toque nas sugestões disponíveis para ver o ajuste recomendado.",
      ],
      note: "As sugestões aparecem conforme o uso: não ver um aviso é normal. Avalie o consumo novamente depois de alguns dias.",
      extra: {
        title: "Confira também a saúde da bateria",
        path: [
          "Ajustes",
          "Bateria",
          m.chargeLimit
            ? "Saúde da Bateria"
            : "Saúde da Bateria e Carregamento",
        ],
        text: "Se o iOS recomendar serviço para a bateria, siga a orientação exibida.",
      },
    }),
    sources: [
      ...source("Entenda o consumo e as sugestões", apple("120745")),
      ...source("Uso e saúde da bateria por modelo", manual("iphd453d043a")),
    ],
  },
  {
    id: "brilho",
    title: "Brilho da tela",
    subtitle: "Use apenas a luminosidade de que precisa",
    category: "display",
    icon: "display",
    description:
      "A tela muito brilhante exige mais energia. Reduza a luminosidade até um nível confortável para o ambiente.",
    content: (m) => ({
      path: ["Ajustes", "Tela e Brilho"],
      steps: [
        ...openSettings("Tela e Brilho"),
        "Localize o **controle de brilho** e arraste-o para a **esquerda**, até a tela ficar confortável de ler.",
        `Para ajustes rápidos depois: ${openControlCenter(m)} Arraste o controle de brilho para **baixo**.`,
      ],
      note: "Mantenha a tela legível. Não é necessário usar sempre o brilho mínimo.",
    }),
    sources: [
      ...source("Ajuste o brilho e as cores", manual("iph60ba71065")),
      ...source("Central de Controle por modelo", apple("108330")),
    ],
  },
  {
    id: "brilho-automatico",
    title: "Brilho Automático",
    subtitle: "Deixe o iPhone ajustar por você",
    category: "display",
    icon: "accessibility",
    description:
      "O sensor de luz adapta o brilho ao ambiente e evita iluminação excessiva em lugares escuros.",
    content: fixed(
      [
        "Ajustes",
        "Acessibilidade",
        "Tela e Tamanho do Texto",
        "Brilho Automático",
      ],
      [
        ...openSettings("Acessibilidade", "Tela e Tamanho do Texto"),
        "Role até o **fim da tela** para encontrar **Brilho Automático**.",
        "Mantenha **Brilho Automático** ativado. Se o controle estiver desligado, toque nele para ativá-lo.",
      ],
      "Este controle fica em Acessibilidade. Em ambientes claros, o brilho pode subir para manter a leitura.",
    ),
    sources: source("Brilho automático", apple("109351")),
  },
  {
    id: "bloqueio",
    title: "Bloqueio Automático",
    subtitle: "Evite deixar a tela acesa sem uso",
    category: "display",
    icon: "display",
    description:
      "Um intervalo curto reduz o tempo em que a tela permanece ligada quando você deixa de usar o iPhone.",
    content: fixed(
      ["Ajustes", "Tela e Brilho", "Bloqueio Automático"],
      [
        ...openSettings("Tela e Brilho", "Bloqueio Automático"),
        "Toque em **30 segundos** ou no menor intervalo que for confortável para sua rotina.",
        "Confira a marca de seleção ao lado do intervalo escolhido. Evite **Nunca** se não precisar manter a tela ligada.",
      ],
      "Você precisará despertar a tela mais vezes. O Modo Pouca Energia pode fixar o intervalo em 30 segundos; políticas de trabalho também podem limitar opções.",
    ),
    sources: source("Tempo de tela ativa", manual("iph7117338a8")),
  },
  {
    id: "sempre-ativada",
    title: "Tela Sempre Ativada",
    subtitle: "Apague a tela quando o iPhone estiver bloqueado",
    category: "display",
    icon: "display",
    available: (m) => m.alwaysOn,
    description:
      "Desligue a exibição contínua da Tela Bloqueada se você não precisa ver as informações com o aparelho em repouso.",
    content: fixed(
      ["Ajustes", "Tela e Brilho", "Tela Sempre Ativada"],
      [
        ...openSettings("Tela e Brilho", "Tela Sempre Ativada"),
        "Desative o controle **Tela Sempre Ativada**.",
        "Bloqueie o iPhone para conferir o resultado. Desperte a tela quando quiser consultar a hora ou as notificações.",
      ],
      "A tela já se apaga automaticamente em algumas situações. No iPhone Air, esse recurso vem desativado por padrão.",
    ),
    sources: source("Modelos e Tela Sempre Ativada", apple("109351")),
  },
  {
    id: "modo-escuro",
    title: "Modo Escuro",
    subtitle: "Aproveite os fundos escuros da tela OLED",
    category: "display",
    icon: "display",
    available: (m) => m.oled,
    description:
      "Em uma tela OLED, pixels pretos emitem menos luz. A aparência escura pode ajudar, dependendo do brilho e do conteúdo exibido.",
    content: fixed(
      ["Ajustes", "Tela e Brilho"],
      [
        ...openSettings("Tela e Brilho"),
        "Na seção **Aparência**, toque em **Escura**.",
        "Se quiser manter essa aparência o dia inteiro, desative **Automática**.",
      ],
      "O resultado depende dos apps e das cores na tela. Não há uma porcentagem fixa de economia.",
    ),
    sources: source("Ative o Modo Escuro", apple("108350")),
  },
  {
    id: "quadros",
    title: "Limitar Taxa de Quadros",
    subtitle: "Limite o ProMotion a 60 quadros por segundo",
    category: "display",
    icon: "accessibility",
    available: (m) => m.frameLimit,
    description:
      "Limite a taxa máxima da tela quando preferir reduzir a fluidez das animações.",
    content: fixed(
      ["Ajustes", "Acessibilidade", "Movimento", "Limitar Taxa de Quadros"],
      [
        ...openSettings("Acessibilidade", "Movimento"),
        "Localize **Limitar Taxa de Quadros** e ative o controle para limitar a tela a **60 quadros por segundo**.",
      ],
      "A rolagem fica menos fluida. O ProMotion já adapta a taxa ao conteúdo; o ganho depende do uso.",
    ),
    sources: source("Movimento e limite de quadros", manual("iph0b691d3ed")),
  },
  {
    id: "movimento",
    title: "Reduzir Movimento",
    subtitle: "Simplifique as animações da interface",
    category: "display",
    icon: "accessibility",
    description:
      "Troque parte dos efeitos de movimento por transições mais simples.",
    content: fixed(
      ["Ajustes", "Acessibilidade", "Movimento", "Reduzir Movimento"],
      [
        ...openSettings("Acessibilidade", "Movimento"),
        "Ative **Reduzir Movimento**. Volte à Tela de Início e abra um app para perceber a mudança nas transições.",
      ],
      "É sobretudo um ajuste de conforto visual. A Apple não quantifica um ganho de bateria para ele.",
    ),
    sources: source("Personalize o movimento", manual("iph0b691d3ed")),
  },
  {
    id: "transparencia",
    title: "Reduzir Transparência",
    subtitle: "Prefira fundos mais sólidos e legíveis",
    category: "display",
    icon: "accessibility",
    description:
      "Substitua parte dos fundos transparentes e desfocados por superfícies mais opacas.",
    content: fixed(
      [
        "Ajustes",
        "Acessibilidade",
        "Tela e Tamanho do Texto",
        "Reduzir Transparência",
      ],
      [
        ...openSettings("Acessibilidade", "Tela e Tamanho do Texto"),
        "Localize **Reduzir Transparência** e ative o controle. Os fundos de menus e outras superfícies ficarão mais opacos.",
      ],
      "O visual muda, inclusive em superfícies do Liquid Glass. É uma preferência de legibilidade, sem economia de bateria quantificada pela Apple.",
    ),
    sources: source("Cores e transparência", manual("iph3e2e1fb0")),
  },
  {
    id: "reproducao",
    title: "Reprodução automática",
    subtitle: "Dê o play só quando quiser assistir",
    category: "display",
    icon: "accessibility",
    description:
      "Evite que prévias e imagens em movimento sejam reproduzidas sem sua escolha.",
    content: fixed(
      ["Ajustes", "Acessibilidade", "Movimento"],
      [
        ...openSettings("Acessibilidade", "Movimento"),
        "Localize **Pré-visualização Automática** e desative o controle para evitar prévias de vídeo automáticas nos apps compatíveis.",
        "Desative também **Reproduzir Automaticamente Imagens Animadas**, se preferir iniciar essas animações manualmente.",
      ],
      "Esses controles atuam em apps compatíveis. Redes sociais podem ter seus próprios ajustes de reprodução.",
      {
        title: "No app Fotos",
        path: ["Fotos", "Coleções", "Sua conta"],
        text: "Abra **Fotos**, toque em **Coleções** e depois no **botão da sua conta**. Desative **Reprodução Automática de Movimento** e **Vídeos em Loop** para impedir a reprodução contínua nas coleções.",
      },
    ),
    sources: [
      ...source("Vídeos e imagens animadas", manual("iph0b691d3ed")),
      ...source("Reprodução nas coleções do Fotos", manual("iph4f36c4148")),
    ],
  },
  {
    id: "siri",
    title: "Ativação da Siri",
    subtitle: "Escolha quando a assistente pode responder",
    category: "apps",
    icon: "siri",
    description:
      "Se você não usa comandos por voz, desative essa forma de ativação da Siri.",
    content: (m) => ({
      path: siriPath(m),
      steps: [
        ...openSettings(),
        m.appleIntelligence
          ? "Toque em **Apple Intelligence e Siri**. Se o menu estiver identificado apenas como **Siri**, abra essa opção."
          : "Toque em **Siri**.",
        m.appleIntelligence
          ? "Toque em **Fale e Digite para a Siri** ou em **Falar com a Siri**, conforme o nome exibido."
          : "Toque em **Falar com a Siri**.",
        "Toque em **Desativado** para impedir que a Siri seja ativada pela voz.",
        `Para desativar também o acesso por botão, procure **${m.homeButton ? "Pressionar Início para Siri" : "Pressionar Botão Lateral para Siri"}** nos ajustes da Siri e desligue o controle. Se necessário, volte à tela anterior. Confirme a desativação, se solicitado.`,
      ],
      note: "Você perde as formas de chamar a Siri que desativar. O ganho de bateria não é quantificado." +
        (m.appleIntelligence ? " Os nomes dos menus podem variar conforme a configuração e a disponibilidade da Apple Intelligence; siga o nome exibido no seu iPhone." : ""),
    }),
    sources: source("Configure ou desative a Siri", manual("iph83aad8922")),
  },
  {
    id: "segundo-plano",
    title: "Atualização em 2º Plano",
    subtitle: "Atualize apenas os apps que precisam",
    category: "apps",
    icon: "general",
    description:
      "Alguns apps buscam conteúdo mesmo quando não estão na tela. Revise os que realmente precisam se manter atualizados.",
    content: fixed(
      ["Ajustes", "Geral", "Atualização em 2º Plano"],
      [
        ...openSettings("Geral", "Atualização em 2º Plano"),
        "Na lista, desative o controle ao lado de cada **app** que não precisa atualizar conteúdo enquanto estiver fechado.",
        "Se preferir desativar para todos, toque em **Atualização em 2º Plano** no início dessa tela e escolha **Desativado**.",
      ],
      "O conteúdo pode atualizar só ao abrir o app. Isso não interrompe toda atividade em segundo plano, como reprodução de áudio.",
    ),
    sources: source("Atualização em segundo plano", apple("118408")),
  },
  {
    id: "localizacao",
    title: "Serviços de Localização",
    subtitle: "Revise a permissão de cada aplicativo",
    category: "apps",
    icon: "privacy",
    description:
      "Conceda acesso contínuo à localização apenas quando a função do app realmente exigir.",
    content: fixed(
      ["Ajustes", "Privacidade e Segurança", "Serviços de Localização"],
      [
        ...openSettings("Privacidade e Segurança", "Serviços de Localização"),
        "Role até a lista de apps e toque em um **aplicativo** para revisar sua permissão.",
        "Escolha **Durante o Uso do App** quando isso for suficiente. Use **Nunca** se o app não precisar da sua localização.",
        "Se uma área aproximada bastar, desative **Localização Precisa**. Mantenha-a quando precisar de precisão, como na navegação.",
        "Volte à lista e repita nos outros apps, preservando as permissões necessárias às funções que você usa.",
      ],
      "Mapas, transporte e lembretes por localização podem precisar de permissões específicas. Evite desligar o serviço inteiro; as opções variam por app.",
    ),
    sources: source("Permissões de localização", apple("102647")),
  },
  {
    id: "notificacoes",
    title: "Notificações",
    subtitle: "Menos despertares desnecessários da tela",
    category: "apps",
    icon: "notifications",
    description:
      "Reduza alertas que não precisam da sua atenção, especialmente de apps que enviam muitas notificações.",
    content: fixed(
      ["Ajustes", "Notificações", "Escolha um app"],
      [
        ...openSettings("Notificações"),
        "Toque no **app** cujos alertas você quer reduzir.",
        "Se não precisar receber seus alertas, desative **Permitir Notificações**.",
        "Para continuar recebendo notificações sem exibi-las na tela bloqueada, mantenha a permissão e desmarque **Tela Bloqueada** na seção de alertas.",
        "Volte à lista para revisar outros apps, mantendo os alertas importantes para você.",
      ],
      "Preserve os alertas importantes para você. Sem permissão, o app não mostrará suas notificações.",
    ),
    sources: source("Ajustes de notificação", manual("iph7c3d96bab")),
  },
  {
    id: "teclado",
    title: "Retorno tátil do teclado",
    subtitle: "Desative a vibração ao digitar",
    category: "apps",
    icon: "sounds",
    description:
      "A resposta tátil a cada tecla pode afetar a duração da bateria. Desative-a se você não faz questão dessa sensação.",
    content: fixed(
      ["Ajustes", "Resposta Tátil e Som", "Feedback do Teclado"],
      [
        ...openSettings("Resposta Tátil e Som", "Feedback do Teclado"),
        "Desative **Tato**. O controle **Som** é independente: deixe-o como preferir.",
        "Abra um campo de texto e digite para conferir que o teclado não vibra mais.",
      ],
      "O teclado deixa de vibrar ao digitar. O controle Som é independente e pode continuar como você preferir.",
    ),
    sources: [
      ...source("Ajustes de som e resposta tátil", manual("iph07c867f28")),
      ...source("Resposta tátil do teclado", apple("102463")),
    ],
  },
  {
    id: "mail",
    title: "Obtenção de dados do Mail",
    subtitle: "Busque novos e-mails com menos frequência",
    category: "apps",
    icon: "mail",
    description:
      "Se você não precisa receber cada e-mail imediatamente, reduza a frequência de consulta das contas.",
    content: fixed(
      ["Ajustes", "Apps", "Mail", "Contas do Mail", "Obter Novos Dados"],
      [
        ...openSettings("Apps", "Mail", "Contas do Mail", "Obter Novos Dados"),
        "Se não precisar da entrega imediata nas contas compatíveis, desative **Push**.",
        "Na seção **Obter**, escolha **Manualmente** ou um intervalo maior entre as consultas.",
        "Toque no nome de cada **conta** e confira o método de obtenção disponível. Com **Manualmente**, abra o Mail quando quiser verificar novas mensagens.",
      ],
      "Novos e-mails podem demorar a aparecer. Automaticamente busca em segundo plano quando o iPhone está carregando e no Wi-Fi. As opções dependem do provedor.",
    ),
    sources: [
      ...source("Intervalos de atualização", manual("iph44d1ae58a")),
      ...source("Push e Obter no Mail", apple("102578")),
    ],
  },
  {
    id: "5g",
    title: "5G Automático ou 4G/LTE",
    subtitle: "Ajuste a rede à sua necessidade",
    category: "network",
    icon: "cellular",
    available: (m) => m.fiveG,
    description:
      "Use 5G Automático para o iPhone alternar para LTE quando a velocidade extra não fizer diferença.",
    content: fixed(
      ["Ajustes", "Celular", "Opções de Dados Celulares", "Voz e Dados"],
      [
        ...openSettings("Celular"),
        "Se usar **Dois SIMs**, toque primeiro na **linha** que deseja configurar.",
        "Toque em **Opções de Dados Celulares**, se essa opção aparecer, e depois em **Voz e Dados**.",
        "Selecione **5G Automático** para o iPhone alternar a rede conforme a necessidade.",
        "Se não precisar de 5G, escolha **LTE** ou **4G**, conforme o nome exibido, e compare a conexão na sua rotina.",
      ],
      "Com Dois SIMs, escolha primeiro a linha em Celular. Nomes e opções dependem da operadora, do plano e da região; a velocidade pode diminuir ao usar LTE/4G.",
    ),
    sources: source("5G e Dados Inteligentes", apple("108383")),
  },
  {
    id: "ligacoes-wifi",
    title: "Ligações Wi-Fi",
    subtitle: "Use o Wi-Fi onde o sinal celular é fraco",
    category: "network",
    icon: "phone",
    description:
      "Uma boa rede Wi-Fi pode permitir ligações em locais com cobertura celular ruim.",
    content: fixed(
      ["Ajustes", "Celular", "Ligações Wi-Fi"],
      [
        ...openSettings("Celular"),
        "Se houver mais de uma linha, toque na **linha** que usará para as ligações.",
        "Toque em **Ligações Wi-Fi**.",
        "Ative **Ligações Wi-Fi Neste iPhone** e siga as instruções exibidas pela operadora.",
        "Conecte-se a uma **rede Wi-Fi estável**. Se solicitado, informe ou confirme o endereço para serviços de emergência.",
      ],
      "Disponibilidade depende da operadora e da região. É necessário Wi-Fi estável; ativar a opção não garante economia em todo ambiente.",
    ),
    sources: source("Configure Ligações Wi-Fi", apple("108066")),
  },
  {
    id: "acesso-pessoal",
    title: "Acesso Pessoal",
    subtitle: "Pare de compartilhar quando terminar",
    category: "network",
    icon: "hotspot",
    description:
      "Compartilhar a conexão usa o rádio celular e a conexão com outros dispositivos. Encerre esse uso quando não precisar dele.",
    content: fixed(
      ["Ajustes", "Acesso Pessoal"],
      [
        ...openSettings(),
        "Toque em **Acesso Pessoal**. Se não estiver na tela inicial dos Ajustes, abra **Celular** e procure essa opção.",
        "Desative **Permitir Acesso a Outros** quando terminar de compartilhar a internet.",
        "Desconecte também os aparelhos que estavam usando a conexão, inclusive os conectados por **cabo**.",
      ],
      "Os aparelhos conectados perdem o acesso compartilhado. Dispositivos da mesma Conta Apple ou família ainda podem usar Instant Hotspot. O menu também pode estar em Celular e depende do plano.",
    ),
    sources: source("Conexões ao Acesso Pessoal", apple("111785")),
  },
  {
    id: "assistencia-wifi",
    title: "Assistência Wi-Fi",
    subtitle: "Evite alternar para dados sem perceber",
    category: "network",
    icon: "cellular",
    description:
      "Quando o Wi-Fi está ruim, esse recurso pode usar dados celulares. Desative se preferir permanecer só nessa conexão Wi-Fi.",
    content: fixed(
      ["Ajustes", "Celular", "Assistência Wi-Fi"],
      [
        ...openSettings("Celular"),
        "Role até o **fim da tela** e encontre **Assistência Wi-Fi**, que também pode aparecer como **Assistência ao Wi-Fi**.",
        "Desative o controle para evitar que o iPhone use dados celulares automaticamente quando o Wi-Fi estiver fraco.",
      ],
      "A internet pode falhar ou ficar lenta quando o Wi-Fi estiver fraco. Isso limita a troca para dados celulares; a economia de bateria depende do sinal e do uso.",
    ),
    sources: source("Assistência ao Wi-Fi", apple("102228")),
  },
  {
    id: "aviao",
    title: "Modo Avião sem cobertura",
    subtitle: "Evite a procura constante por sinal",
    category: "network",
    icon: "airplane",
    description:
      "Durante um período conhecido sem cobertura celular, como um trecho de viagem, ative o Modo Avião.",
    content: fixed(
      ["Ajustes", "Modo Avião"],
      [
        ...openSettings(),
        "Localize **Modo Avião** na tela inicial dos Ajustes e ative o controle durante o período sem cobertura celular.",
        "Se houver uma rede disponível, toque em **Wi-Fi** e ative-o novamente para usar a internet. A rede celular continuará desligada.",
        "Quando voltar a uma área com cobertura, retorne a **Ajustes** e desative **Modo Avião**.",
      ],
      "Você fica sem ligações, SMS e dados pela rede celular. Wi-Fi e Bluetooth podem ser usados separadamente. Ligações via Wi-Fi exigem suporte e configuração da operadora.",
    ),
    sources: [
      ...source("Como funciona o Modo Avião", apple("108785")),
      ...source("Sinal fraco e consumo", apple("120745")),
    ],
  },
  {
    id: "carregamento",
    title: "Carregamento e saúde da bateria",
    subtitle: "Cuide da capacidade ao longo do tempo",
    category: "care",
    icon: "battery",
    description:
      "Os ajustes de carregamento reduzem o desgaste ao longo do tempo. Eles não fazem a carga atual render mais horas.",
    content: (m) => ({
      path: chargingPath(m),
      steps: [
        ...openSettings(...chargingPath(m).slice(1)),
        ...(m.chargeLimit
          ? [
              "Em **Limite de Carregamento**, escolha uma porcentagem entre **80% e 100%**, em intervalos de 5%, suficiente para sua rotina.",
              "Se preferir carregar até **100%**, selecione esse limite e ative **Carregamento Otimizado**.",
            ]
          : [
              "Localize **Carregamento Otimizado** e ative o controle.",
              "Mantenha uma **rotina de carregamento** para o iPhone aprender quando você costuma desconectá-lo da tomada.",
            ]),
      ],
      note: m.chargeLimit
        ? "Um limite menor deixa menos carga disponível no dia. O Carregamento Otimizado fica disponível em 100%. O iPhone pode ocasionalmente carregar até 100% mesmo com limite menor, para calibrar a estimativa."
        : "O carregamento pode pausar após 80% e terminar perto do horário de uso previsto. O recurso precisa aprender sua rotina e pode não atuar em todos os locais.",
    }),
    sources: source("Limite e Carregamento Otimizado", apple("108055")),
  },
];
export const compatibleTips = (m: Model) =>
  tips.filter((t) => !t.available || t.available(m));
