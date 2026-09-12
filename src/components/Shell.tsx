import { type CSSProperties, type ReactNode } from "react";
import {
  Page,
  PageContent,
  Navbar,
  Toolbar,
  Block,
  BlockTitle,
  Gauge,
} from "framework7-react";
import { useGuide } from "../state";
function StorageAlert() {
  const { storageError } = useGuide();
  if (!storageError) return null;
  return (
    <Block strong inset {...{ role: "alert" }}>
      Seu navegador não permitiu salvar o progresso. Ele será mantido apenas
      enquanto o guia estiver aberto.
    </Block>
  );
}
// Tab pages render inside MainTabs, which owns the Navbar and the tab bar.
// Subpages get the standard Framework7 page: fixed Navbar, optional bottom
// Toolbar for actions, and PageContent scrolling underneath both.
export function Shell({
  children,
  title,
  back = false,
  name,
  footer,
  footerHeight,
  hideBack = false,
  transparent = false,
}: {
  children: ReactNode;
  title?: string;
  back?: boolean;
  name: string;
  footer?: ReactNode;
  footerHeight?: number;
  hideBack?: boolean;
  transparent?: boolean;
}) {
  if (!back)
    return (
      <main className="content-wrap">
        <StorageAlert />
        {children}
      </main>
    );
  const style = footerHeight
    ? ({ "--f7-toolbar-height": `${footerHeight}px` } as CSSProperties)
    : undefined;
  return (
    <Page
      name={name}
      pageContent={false}
      className="guide-page subpage"
      style={style}
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
        title={title}
        backLink={!hideBack ? "Voltar" : undefined}
        backLinkShowText
        backLinkUrl="/"
        transparent={transparent}
      />
      {footer && (
        <Toolbar bottom className="page-actions">
          <div className="content-wrap page-actions-inner">{footer}</div>
        </Toolbar>
      )}
      <PageContent>
        <main className="content-wrap">
          <StorageAlert />
          {children}
        </main>
      </PageContent>
    </Page>
  );
}
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
      <Block className="page-description">{description}</Block>
    </>
  );
}
// Circular gauge from Framework7 with the accessible progressbar semantics on
// its wrapper. The same summary is used on the Home and Progress tabs.
export function ProgressSummary({ large = false }: { large?: boolean }) {
  const { markedCount, count, laterCount, available } = useGuide();
  const total = available.length;
  const percent = total ? Math.round((markedCount / total) * 100) : 0;
  const pending = total - markedCount;
  return (
    <Block
      strong
      inset
      className={`progress-summary ${large ? "progress-summary-large" : ""}`}
    >
      <div
        className="progress-gauge"
        {...{ role: "progressbar" }}
        aria-label="Progresso do guia"
        aria-valuenow={markedCount}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuetext={`${markedCount} de ${total} dicas marcadas`}
      >
        <Gauge
          type="circle"
          value={total ? markedCount / total : 0}
          size={large ? 168 : 92}
          borderWidth={large ? 14 : 9}
          borderColor="#30d158"
          borderBgColor="rgba(255, 255, 255, 0.12)"
          valueText={large ? `${percent}%` : String(markedCount)}
          valueTextColor="#ffffff"
          valueFontSize={large ? 34 : 24}
          valueFontWeight={700}
          labelText={large ? `${markedCount} de ${total}` : `de ${total}`}
          labelTextColor="#8e8e93"
          labelFontSize={large ? 15 : 12}
          labelFontWeight={500}
        />
      </div>
      <div className="progress-summary-text">
        <p className="progress-summary-title">
          {markedCount === 0
            ? "Comece pelas dicas"
            : pending === 0
              ? "Guia revisado"
              : `${pending} ${pending === 1 ? "dica pendente" : "dicas pendentes"}`}
        </p>
        <p className="progress-summary-caption">
          {markedCount} de {total} dicas marcadas
        </p>
        <ul className="progress-legend" aria-label="Detalhes do progresso">
          <li className="progress-legend-completed">
            <span className="progress-dot" aria-hidden="true" />
            {count} {count === 1 ? "concluída" : "concluídas"}
          </li>
          <li className="progress-legend-later">
            <span className="progress-dot" aria-hidden="true" />
            {laterCount} para depois
          </li>
        </ul>
      </div>
    </Block>
  );
}
