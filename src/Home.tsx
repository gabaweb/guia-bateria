import { Icon, List, ListItem } from "framework7-react";
import { useGuide } from "./state";
import { settingsIcons } from "./data/icons";
import { Shell, PageHeading, ProgressBar } from "./components/Shell";
import { TipList } from "./components/TipList";
export function Home() {
  const { model, available } = useGuide();
  return (
    <Shell name="home">
      <PageHeading
        title="Economize bateria"
        description="Pequenos ajustes para o seu iPhone ir mais longe."
      />
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
      <ProgressBar />
      <TipList items={available} />
    </Shell>
  );
}
