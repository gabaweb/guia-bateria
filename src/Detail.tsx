import { Fragment, useRef } from "react";
import type { Router } from "framework7/types";
import {
  Icon,
  Button,
  Link,
  List,
  ListItem,
  Block,
  BlockTitle,
  Badge,
} from "framework7-react";
import { settingsIcons, tipStatusIndicators } from "./data/icons";
import { tips } from "./data/tips";
import { useGuide } from "./state";
import { Shell } from "./components/Shell";
// Editorial emphasis is rendered as text/strong elements, never injected HTML.
function emphasize(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : part,
  );
}
export function Path({ items }: { items: string[] }) {
  return (
    <Block
      strong
      inset
      className="settings-path"
      {...{ role: "note" }}
      aria-label="Caminho"
    >
      {items.map((item, index) => (
        <Fragment key={`${item}-${index}`}>
          {index > 0 && (
            <>
              {" "}
              <Icon f7="chevron_right" size={12} textColor="gray" aria-hidden="true" />
              <span className="visually-hidden"> &gt; </span>
              {" "}
            </>
          )}
          <strong>{item}</strong>
        </Fragment>
      ))}
    </Block>
  );
}
export function Detail({ id, f7router }: { id: string; f7router: Router.Router }) {
  const { model, available, statusOf, setStatus } = useGuide();
  const returning = useRef(false);
  const tip = tips.find((t) => t.id === id);
  if (!tip || !available.some((t) => t.id === id))
    return (
      <Shell name="unavailable" back title="Dica indisponível">
        <Block className="empty-state" strong inset>
          <BlockTitle large {...{ role: "heading" }} aria-level={1}>
            {tip
              ? "Essa dica não se aplica ao seu iPhone"
              : "Dica não encontrada"}
          </BlockTitle>
          <p>O guia mostra apenas os recursos compatíveis com {model.name}.</p>
          <Button round fill href="/">
            Voltar ao guia
          </Button>
          <Link href="/aparelho/">Alterar iPhone</Link>
        </Block>
      </Shell>
    );
  const content = tip.content(model);
  const status = statusOf(id);
  const indicator = status === "pending" ? null : tipStatusIndicators[status];
  const saveAndBack = (status: "completed" | "later") => {
    if (returning.current || !f7router.allowPageChange) return;
    returning.current = true;
    setStatus(id, status);
    // Same native back action and direct-link fallback as Shell's Navbar.
    // Framework7 supports replaceState in back.js, but omits it from RouteOptions.
    const options: Router.RouteOptions & { replaceState: boolean } = {
      replaceState: f7router.history.length < 2,
    };
    f7router.back("/", options);
  };
  return (
    <Shell
      name={`tip-${id}`}
      back
      title="Guia Bateria"
      footer={
        <Block className="detail-action no-margin no-padding">
          <Button
            round
            type="button"
            fill
            large
            color="green"
            textColor="black"
            onClick={() => saveAndBack("completed")}
          >
            Concluir
          </Button>
          <Button
            round
            type="button"
            fill
            large
            color="orange"
            textColor="black"
            className="margin-top-half"
            onClick={() => saveAndBack("later")}
          >
            Deixar para depois
          </Button>
        </Block>
      }
    >
      <BlockTitle
        large
        className="tip-heading display-flex align-items-center"
        {...{ role: "heading" }}
        aria-level={1}
      >
        <Icon
          {...settingsIcons[tip.icon]}
          className="settings-icon margin-right flex-shrink-0"
          textColor="white"
          size={20}
          aria-hidden="true"
        />
        <span>{tip.title}</span>
      </BlockTitle>
      <Block>
        {tip.subtitle}
        {indicator && (
          <p
            className={`detail-status no-margin-bottom display-flex align-items-center text-color-${indicator.color}`}
          >
            <Icon
              f7={indicator.f7}
              size={18}
              className="margin-right-half"
              aria-hidden="true"
            />
            {indicator.label}
          </p>
        )}
      </Block>
      <Block>{tip.description}</Block>
      <BlockTitle {...{ role: "heading" }} aria-level={2}>Caminho</BlockTitle>
      <Path items={content.path} />
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        Como fazer
      </BlockTitle>
      <List inset strong dividers className="steps">
        {content.steps.map((step, index) => (
          <ListItem key={`${index}-${step}`}>
            <Badge slot="media">{index + 1}</Badge>
            <span slot="title">{emphasize(step)}</span>
          </ListItem>
        ))}
      </List>
      {content.extra && (
        <>
          <BlockTitle>{content.extra.title}</BlockTitle>
          <Path items={content.extra.path} />
          <Block>{emphasize(content.extra.text)}</Block>
        </>
      )}
      <BlockTitle>O que muda na prática</BlockTitle>
      <Block strong inset>
        {content.note}
      </Block>
      <BlockTitle>Saiba mais na Apple</BlockTitle>
      <List inset strong dividers>
        {tip.sources.map((source) => (
          <ListItem
            key={source.url}
            title={source.name}
            link={source.url}
            external
            target="_blank"
            {...{ rel: "noopener noreferrer" }}
          />
        ))}
      </List>
      <Block className="review-explanation">
        As duas ações salvam sua escolha e voltam à tela de onde você abriu a dica.
        Você decide quais ajustes fazem sentido para sua rotina.
      </Block>
    </Shell>
  );
}
