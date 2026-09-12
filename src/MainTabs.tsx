import { useState } from "react";
import {
  Page,
  Navbar,
  Icon,
  Block,
  Segmented,
  Button,
  Tabs,
  Tab,
} from "framework7-react";
import type { Router } from "framework7/types";
import { settingsIcons } from "./data/icons";
const sections = [
  { id: "home", path: "/", label: "Guia" },
  { id: "progress", path: "/progresso/", label: "Progresso" },
  { id: "about", path: "/sobre/", label: "Sobre" },
];
export function MainTabs({ f7route }: { f7route: Router.Route }) {
  const [active, setActive] = useState(
    sections.find((section) => section.path === f7route.url)?.id || "home",
  );
  return (
    <Page
      name={active}
      pageContent={false}
      className="guide-page main-tabs-page"
    >
      <Navbar title="Guia Bateria">
        <Icon
          slot="title"
          {...settingsIcons.battery}
          className="settings-icon margin-right-half"
          textColor="white"
          size={20}
          aria-hidden="true"
        />
      </Navbar>
      <Block
        className="main-navigation content-wrap padding-horizontal margin-vertical-half"
        {...{ role: "navigation" }}
        aria-label="Navegação principal"
      >
        <Segmented strong round>
          {sections.map((section) => (
            <Button
              key={section.id}
              href={section.path}
              tabLink
              tabLinkActive={active === section.id}
              active={active === section.id}
              aria-current={active === section.id ? "page" : undefined}
            >
              {section.label}
            </Button>
          ))}
        </Segmented>
      </Block>
      <Tabs routable>
        {sections.map((section) => (
          <Tab
            key={section.id}
            id={section.id}
            className="page-content"
            onTabShow={() => setActive(section.id)}
          />
        ))}
      </Tabs>
    </Page>
  );
}
