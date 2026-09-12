import { useState } from "react";
import {
  List,
  ListItem,
  Button,
  Block,
  BlockTitle,
  BlockFooter,
} from "framework7-react";
import type { Router } from "framework7/types";
import { models } from "./data/models";
import { useGuide } from "./state";
import { Shell, PageHeading } from "./components/Shell";
import { Path } from "./Detail";
export function ModelPicker({ f7router }: { f7router: Router.Router }) {
  const { model, saved, selectModel } = useGuide();
  const [chosen, setChosen] = useState(saved.selected ? model.id : "");
  const chosenModel = models.find((m) => m.id === chosen);
  return (
    <Shell
      name="models"
      back
      hideBack={!saved.selected}
      title="Seu iPhone"
      footerHeight={80}
      footer={
        <Button
          round
          type="button"
          fill
          large
          disabled={!chosen}
          aria-disabled={!chosen}
          onClick={() => {
            if (!chosen) return;
            if (!saved.selected) window.history.replaceState(null, "", "/");
            selectModel(chosen);
            if (saved.selected) f7router.navigate("/", { reloadAll: true });
          }}
        >
          {chosenModel ? `Usar ${chosenModel.name}` : "Escolha seu iPhone"}
        </Button>
      }
    >
      <PageHeading
        title="Qual é o seu iPhone?"
        description="As dicas e os caminhos se adaptam ao seu modelo."
      />
      <BlockTitle {...{ role: "heading" }} aria-level={2}>
        Não sabe o modelo?
      </BlockTitle>
      <Path items={["Ajustes", "Geral", "Sobre", "Nome do Modelo"]} />
      <BlockFooter>
        Abra esse caminho no iPhone e confira o nome exibido.
      </BlockFooter>
      {[...new Set(models.map((m) => m.family))].map((family) => (
        <div key={family} className="model-family">
          <BlockTitle {...{ role: "heading" }} aria-level={2}>
            {family}
          </BlockTitle>
          <List inset strong dividers>
            {models
              .filter((m) => m.family === family)
              .map((m) => (
                <ListItem
                  key={m.id}
                  radio
                  name="iphone-model"
                  title={m.name}
                  value={m.id}
                  checked={chosen === m.id}
                  onChange={() => setChosen(m.id)}
                />
              ))}
          </List>
        </div>
      ))}
      <BlockFooter>
        O guia cobre os modelos compatíveis com o iOS 26. O progresso é salvo
        separadamente para cada iPhone.
      </BlockFooter>
    </Shell>
  );
}
