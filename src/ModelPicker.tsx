import { useState } from "react";
import { List, ListItem, Button, Block, BlockTitle } from "framework7-react";
import type { Router } from "framework7/types";
import { models } from "./data/models";
import { useGuide } from "./state";
import { Shell, PageHeading } from "./components/Shell";
export function ModelPicker({ f7router }: { f7router: Router.Router }) {
  const { model, saved, selectModel } = useGuide();
  const [chosen, setChosen] = useState(saved.selected ? model.id : "");
  return (
    <Shell
      name="models"
      back
      hideBack={!saved.selected}
      title="Guia Bateria"
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
          {chosen
            ? `Usar ${models.find((m) => m.id === chosen)?.name}`
            : "Escolha seu iPhone"}
        </Button>
      }
    >
      <PageHeading
        title="Qual é o seu iPhone?"
        description="As dicas e os caminhos se adaptam ao seu modelo."
      />
      <Block className="notice" strong inset>
        <strong>Não sabe o modelo?</strong>
        <p>Abra Ajustes › Geral › Sobre e confira Nome do Modelo.</p>
      </Block>
      {[...new Set(models.map((m) => m.family))].map((family) => (
        <Block key={family}>
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
        </Block>
      ))}
    </Shell>
  );
}
