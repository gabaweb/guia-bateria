import {
  Icon,
  List,
  ListItem,
  Button,
  f7,
  Block,
  BlockTitle,
  BlockFooter,
  Progressbar,
} from "framework7-react";
import { settingsIcons } from "./data/icons";
import { categories } from "./data/tips";
import { useGuide } from "./state";
import { Shell, ProgressSummary } from "./components/Shell";
export function Progress() {
  const { model, available, count, laterCount, statusOf, reset } = useGuide();
  const pending = available.length - count - laterCount;
  const empty = count === 0 && laterCount === 0;
  const stats = [
    { label: "Pendentes", value: pending, tone: "pending" },
    { label: "Concluídas", value: count, tone: "completed" },
    { label: "Para depois", value: laterCount, tone: "later" },
  ];
  return (
    <Shell name="progress" title="Progresso">
      <Block className="page-description">
        Suas marcações para o {model.name}. Elas ficam salvas neste navegador e
        não alteram os Ajustes do iPhone.
      </Block>
      <ProgressSummary large />
      <Block className="stat-grid" {...{ role: "list" }} aria-label="Resumo">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`stat-tile stat-${stat.tone}`}
            {...{ role: "listitem" }}
          >
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </Block>
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        Por categoria
      </BlockTitle>
      <List strong inset dividers className="category-list">
        {categories.map((c) => {
          const group = available.filter((t) => t.category === c.id);
          const done = group.filter((t) => statusOf(t.id) !== "pending").length;
          if (group.length === 0) return null;
          return (
            <ListItem key={c.id} title={c.name} after={`${done} de ${group.length}`}>
              <Icon
                slot="media"
                {...settingsIcons[c.icon]}
                className="settings-icon"
                textColor="white"
                size={20}
                aria-hidden="true"
              />
              <Progressbar
                slot="footer"
                className="category-progress"
                progress={Math.round((done / group.length) * 100)}
                aria-hidden="true"
              />
            </ListItem>
          );
        })}
      </List>
      <BlockFooter>
        O progresso é guardado por modelo. Trocar de iPhone mostra as marcações
        daquele aparelho.
      </BlockFooter>
      <Block className="progress-actions">
        <Button
          round
          fill
          large
          color="red"
          textColor="white"
          type="button"
          disabled={empty}
          aria-disabled={empty}
          className="reset-button"
          onClick={() =>
            !empty &&
            f7.dialog.confirm(
              `Apagar as dicas concluídas e guardadas para depois do ${model.name}? As marcações dos outros modelos serão mantidas.`,
              "Limpar progresso",
              () => reset(),
            )
          }
        >
          Limpar progresso
        </Button>
      </Block>
    </Shell>
  );
}
