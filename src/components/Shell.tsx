import { type ReactNode } from "react";
import {
  Page,
  PageContent,
  Navbar,
  Icon,
  Block,
  BlockTitle,
  Progressbar,
} from "framework7-react";
import { useGuide } from "../state";
import { settingsIcons } from "../data/icons";
export function Shell({
  children,
  title,
  back = false,
  name,
  footer,
  hideBack = false,
}: {
  children: ReactNode;
  title?: string;
  back?: boolean;
  name: string;
  footer?: ReactNode;
  hideBack?: boolean;
}) {
  const { storageError } = useGuide();
  if (!back)
    return (
      <main className="content-wrap">
        {storageError && (
          <Block strong inset {...{ role: "alert" }}>
            Seu navegador não permitiu salvar o progresso. Ele será mantido
            apenas enquanto o guia estiver aberto.
          </Block>
        )}
        {children}
      </main>
    );
  return (
    <Page
      name={name}
      pageContent={false}
      className={`guide-page ${back ? "subpage" : ""}`}
      onPageBeforeIn={(page) => {
        const backLink = page.el.querySelector(".navbar a.back");
        if (!backLink) return;
        backLink.setAttribute("aria-label", "Voltar");
        // Let the native router replace the entry when a deep link has no predecessor.
        if (page.router.history.length < 2)
          backLink.dataset.replaceState = "true";
        else delete backLink.dataset.replaceState;
      }}
    >
      <Navbar
        title={back ? title : "Guia Bateria"}
        backLink={back && !hideBack ? "Voltar" : undefined}
        backLinkShowText
        backLinkUrl="/"
      >
        {title === "Guia Bateria" && (
          <Icon
            slot="title"
            {...settingsIcons.battery}
            className="settings-icon margin-right-half"
            textColor="white"
            size={20}
            aria-hidden="true"
          />
        )}
      </Navbar>
      <PageContent>
        <main className="content-wrap">
          {storageError && (
            <Block strong inset {...{ role: "alert" }}>
              Seu navegador não permitiu salvar o progresso. Ele será mantido
              apenas enquanto o guia estiver aberto.
            </Block>
          )}
          {children}
        </main>
      </PageContent>
      {footer && (
        <footer className="page-actions">
          <div className="content-wrap">{footer}</div>
        </footer>
      )}
    </Page>
  );
}
// These functions only compose Framework7 components; they have no custom skin or markup.
export function PageHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <BlockTitle large {...{ role: "heading" }} aria-level={1}>
        {title}
      </BlockTitle>
      <Block>{description}</Block>
    </>
  );
}
export function ProgressBar() {
  const { markedCount, count, laterCount, available } = useGuide();
  const percent = Math.round((markedCount / available.length) * 100);
  return (
    <Block strong inset>
      <p>
        {markedCount} de {available.length} dicas marcadas
      </p>
      <Progressbar
        progress={percent}
        {...{ role: "progressbar" }}
        aria-label="Progresso do guia"
        aria-valuenow={markedCount}
        aria-valuemin={0}
        aria-valuemax={available.length}
      />
      <p>
        {count} concluídas · {laterCount} para depois
      </p>
    </Block>
  );
}
