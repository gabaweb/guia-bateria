import {
  Icon,
  List,
  ListItem,
  Button,
  f7,
  Block,
  BlockTitle,
} from "framework7-react";
import { settingsIcons } from "./data/icons";
import { categories } from "./data/tips";
import { useGuide } from "./state";
import { Shell, PageHeading, ProgressBar } from "./components/Shell";
export function Progress() {
  const {
    model,
    available,
    count,
    laterCount,
    statusOf,
    reset,
  } = useGuide();
  return (
    <Shell name="progress">
      <PageHeading
        title="Seu progresso"
        description={`Acompanhe suas escolhas para o ${model.name}.`}
      />
      <ProgressBar />
      <List inset strong dividers>
        <ListItem
          title="Pendentes"
          after={String(available.length - count - laterCount)}
        />
        <ListItem title="Concluídas" after={String(count)} />
        <ListItem title="Para depois" after={String(laterCount)} />
      </List>
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        Por categoria
      </BlockTitle>
      <List strong inset dividers className="category-list">
        {categories.map((c) => {
          const group = available.filter((t) => t.category === c.id);
          return (
            <ListItem
              key={c.id}
              title={c.name}
              after={`${group.filter((t) => statusOf(t.id) !== "pending").length} de ${group.length}`}
            >
              <Icon
                slot="media"
                {...settingsIcons[c.icon]}
                className="settings-icon"
                textColor="white"
                size={20}
                aria-hidden="true"
              />
            </ListItem>
          );
        })}
      </List>
      <Block className="progress-actions">
        <p>
          Seu progresso fica salvo neste navegador, por modelo. As marcações não
          alteram os Ajustes do iPhone.
        </p>
        <Button
          round
          fill
          large
          color="red"
          textColor="white"
          type="button"
          disabled={count === 0 && laterCount === 0}
          aria-disabled={count === 0 && laterCount === 0}
          className="reset-button"
          onClick={() =>
            (count > 0 || laterCount > 0) &&
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
