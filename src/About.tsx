import { List, ListItem, Block, BlockTitle, Link } from "framework7-react";
import { models } from "./data/models";
import { tips, apple, manual } from "./data/tips";
import { useGuide } from "./state";
import { usePwa } from "./pwa";
import { Shell, PageHeading } from "./components/Shell";
export function About() {
  const { model } = useGuide();
  const pwa = usePwa();
  const sources = [
    ...new Map(tips.flatMap((t) => t.sources).map((s) => [s.url, s])).values(),
  ];
  return (
    <Shell name="about">
      <PageHeading
        title="Sobre o Guia Bateria"
        description="Mais controle sobre o seu iPhone, sem complicação."
      />
      <Block className="about-intro">
        <p>
          Um guia independente para você entender e revisar os ajustes do iOS
          26. Escolha seu modelo, leia as dicas e mantenha o que faz sentido
          para você.
        </p>
      </Block>
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        Sempre à mão
      </BlockTitle>
      <Block className="info-panel" strong inset>
        <BlockTitle {...{ role: "heading" }} aria-level={2}>
          Adicione à Tela de Início
        </BlockTitle>
        {pwa.installed ? (
          <p>O Guia Bateria já está aberto como aplicativo.</p>
        ) : (
          <>
            <p>
              No Safari do iPhone, abra o menu de compartilhamento e escolha{" "}
              <strong>Adicionar à Tela de Início</strong>. Ative{" "}
              <strong>Abrir como App da Web</strong>, se aparecer, e toque em
              Adicionar.
            </p>
          </>
        )}
        <p>
          Depois do primeiro carregamento completo, as dicas funcionam sem
          internet. Os links da Apple precisam de conexão.
        </p>
      </Block>
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        Personalizado para você
      </BlockTitle>
      <List inset strong dividers>
        <ListItem
          title="Modelo selecionado"
          after={model.name}
          link="/aparelho/"
        />
        <ListItem title="Sistema de referência" after="iOS 26" />
        <ListItem title="Modelos disponíveis" after={String(models.length)} />
      </List>
      <Block className="body-note">
        Recursos como 5G, OLED, ProMotion, Tela Sempre Ativada e limite de
        carregamento são verificados por modelo. Os caminhos de Bateria e Siri
        também mudam conforme o aparelho. Operadora, região e atualização do
        sistema podem alterar algumas opções.
      </Block>
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        Suas escolhas ficam com você
      </BlockTitle>
      <Block className="info-panel" strong inset>
        <BlockTitle {...{ role: "heading" }} aria-level={2}>
          Sem conta. Sem envio de progresso.
        </BlockTitle>
        <p>
          O modelo, as dicas concluídas e as guardadas para depois ficam no
          armazenamento local deste navegador. Apagar os dados do site remove
          essas escolhas. Não há sincronização entre dispositivos.
        </p>
        <p>
          Este site não lê a bateria nem modifica os Ajustes do iPhone. A
          conclusão de uma dica é apenas uma marcação no guia.
        </p>
      </Block>
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        Como usar as dicas
      </BlockTitle>
      <Block className="info-panel" strong inset>
        <p>
          A autonomia varia com sinal, brilho, apps e hábitos de uso. Não
          atribuímos porcentagens de economia a cada ajuste. Movimento,
          transparência e Busca são preferências opcionais, sem ganho
          quantificado pela Apple.
        </p>
        <p>
          Carregamento Otimizado e limite de carregamento cuidam do desgaste da
          bateria ao longo do tempo. Um limite menor também reduz a carga
          disponível no dia.
        </p>
      </Block>
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        Fontes oficiais · pt-BR
      </BlockTitle>
      <Block className="body-note">
        Conteúdo conferido no Manual de Uso do iPhone e no Suporte da Apple em
        11 de setembro de 2026. Os artigos podem ser atualizados pela Apple.
      </Block>
      <List inset strong dividers className="sources-list">
        <ListItem
          title="Modelos compatíveis com iOS 26"
          link={manual("iphe3fa5df43")}
          external
          target="_blank"
          {...{ rel: "noopener noreferrer" }}
        />
        <ListItem
          title="Identificar o modelo do iPhone"
          link={apple("108044")}
          external
          target="_blank"
          {...{ rel: "noopener noreferrer" }}
        />
        {sources.map((s) => (
          <ListItem
            key={s.url}
            title={s.name}
            link={s.url}
            external
            target="_blank"
            {...{ rel: "noopener noreferrer" }}
          />
        ))}
      </List>
      <Block className="page-footnote">
        Guia Bateria · Versão 1.0
        <br />
        Projeto independente, sem afiliação com a Apple.
        <br />
        <Link
          href="https://github.com/gabaweb/guia-bateria"
          external
          target="_blank"
          {...{ rel: "noopener noreferrer" }}
        >
          Código aberto no GitHub
        </Link>
      </Block>
    </Shell>
  );
}
