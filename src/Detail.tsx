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
  BlockFooter,
  Badge,
} from "framework7-react";
import { settingsIcons, tipStatusIndicators } from "./data/icons";
import { tips, categories } from "./data/tips";
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
              <Icon
                f7="chevron_right"
                size={12}
                textColor="gray"
                aria-hidden="true"
              />
              <span className="visually-hidden"> &gt; </span>{" "}
            </>
          )}
          <strong>{item}</strong>
        </Fragment>
      ))}
    </Block>
  );
}
export function Detail({
  id,
  f7router,
}: {
  id: string;
  f7router: Router.Router;
}) {
  const { model, available, statusOf, setStatus } = useGuide();
  const returning = useRef(false);
  const tip = tips.find((t) => t.id === id);
  if (!tip || !available.some((t) => t.id === id))
    return (
      <Shell name="unavailable" back title="Dica indisponível">
        <Block className="empty-state" strong inset>
          <Icon
            f7="exclamationmark_triangle_fill"
            size={44}
            textColor="orange"
            aria-hidden="true"
          />
          <BlockTitle large {...{ role: "heading" }} aria-level={1}>
            {tip
              ? "Essa dica não se aplica ao seu iPhone"
              : "Dica não encontrada"}
          </BlockTitle>
          <p>O guia mostra apenas os recursos compatíveis com {model.name}.</p>
          <Button round fill large href="/">
            Voltar ao guia
          </Button>
          <Link href="/aparelho/">Alterar iPhone</Link>
        </Block>
      </Shell>
    );
  const content = tip.content(model);
  const status = statusOf(id);
  const indicator = status === "pending" ? null : tipStatusIndicators[status];
  const category = categories.find((c) => c.id === tip.category);
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
      transparent
      title={tip.title}
      footerHeight={122}
      footer={
        <div className="detail-action">
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
            large
            color="orange"
            onClick={() => saveAndBack("later")}
          >
            Deixar para depois
          </Button>
        </div>
      }
    >
      <header className="tip-hero">
        <Icon
          {...settingsIcons[tip.icon]}
          className="settings-icon settings-icon-hero"
          textColor="white"
          size={40}
          aria-hidden="true"
        />
        {category && <p className="tip-hero-category">{category.name}</p>}
        <h1 className="tip-hero-title">{tip.title}</h1>
        <p className="tip-hero-subtitle">{tip.subtitle}</p>
        {indicator && (
          <p
            className={`status-marker ${status} detail-status text-color-${indicator.color}`}
          >
            <Icon f7={indicator.f7} size={16} aria-hidden="true" />
            {indicator.label}
          </p>
        )}
      </header>
      <Block className="tip-description">{tip.description}</Block>
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        Caminho
      </BlockTitle>
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
          <BlockTitle {...{ role: "heading" }} aria-level={2}>
            {content.extra.title}
          </BlockTitle>
          <Path items={content.extra.path} />
          <BlockFooter>{emphasize(content.extra.text)}</BlockFooter>
        </>
      )}
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        O que muda na prática
      </BlockTitle>
      <Block strong inset className="tip-note">
        <Icon f7="lightbulb_fill" size={20} textColor="yellow" aria-hidden="true" />
        <p>{content.note}</p>
      </Block>
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        Saiba mais na Apple
      </BlockTitle>
      <List inset strong dividers>
        {tip.sources.map((source) => (
          <ListItem
            key={source.url}
            title={source.name}
            link={source.url}
            external
            target="_blank"
            {...{ rel: "noopener noreferrer" }}
          >
            <Icon
              slot="after"
              f7="arrow_up_right_square"
              size={18}
              textColor="gray"
              aria-hidden="true"
            />
          </ListItem>
        ))}
      </List>
      <BlockFooter className="review-explanation">
        As duas ações salvam sua escolha e voltam à tela de onde você abriu a
        dica. Você decide quais ajustes fazem sentido para sua rotina.
      </BlockFooter>
    </Shell>
  );
}
