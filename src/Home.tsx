import { Icon, List, ListItem, Block } from "framework7-react";
import { useGuide } from "./state";
import { settingsIcons } from "./data/icons";
import { Shell, ProgressSummary } from "./components/Shell";
import { TipList } from "./components/TipList";
export function Home() {
  const { model, available } = useGuide();
  return (
    <Shell name="home" title="Guia Bateria">
      <Block className="page-description">
        Pequenos ajustes do iOS 26 para o seu iPhone ir mais longe. Abra uma
        dica, siga o caminho e marque o que fizer sentido para você.
      </Block>
      <List inset strong className="model-selector">
        <ListItem link="/aparelho/" title="Seu iPhone" after={model.name}>
          <Icon
            slot="media"
            {...settingsIcons.device}
            className="settings-icon"
            textColor="white"
            size={20}
            aria-hidden="true"
          />
        </ListItem>
      </List>
      <ProgressSummary />
      <TipList items={available} />
    </Shell>
  );
}
