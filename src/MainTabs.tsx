import { useState } from "react";
import {
  Page,
  Navbar,
  Icon,
  Link,
  Toolbar,
  Tabs,
  Tab,
} from "framework7-react";
import type { Router } from "framework7/types";
const sections = [
  { id: "home", path: "/", label: "Guia", icon: "bolt_fill", title: "Guia Bateria" },
  {
    id: "progress",
    path: "/progresso/",
    label: "Progresso",
    icon: "chart_pie_fill",
    title: "Progresso",
  },
  { id: "about", path: "/sobre/", label: "Sobre", icon: "info_circle_fill", title: "Sobre" },
];
export function MainTabs({ f7route }: { f7route: Router.Route }) {
  const [active, setActive] = useState(
    sections.find((section) => section.path === f7route.url)?.id || "home",
  );
  const section = sections.find((s) => s.id === active) || sections[0];
  return (
    <Page name={active} pageContent={false} className="guide-page main-tabs-page">
      <Navbar title={section.title} large titleLarge={section.title} />
      <Toolbar
        tabbar
        icons
        bottom
        className="main-navigation"
        {...{ role: "navigation" }}
        aria-label="Navegação principal"
      >
        <div className="toolbar-pane">
          {sections.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              tabLink
              tabLinkActive={active === item.id}
              aria-current={active === item.id ? "page" : undefined}
            >
              <Icon f7={item.icon} aria-hidden="true" />
              <span className="tabbar-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </Toolbar>
      <Tabs routable>
        {sections.map((item) => (
          <Tab
            key={item.id}
            id={item.id}
            className="page-content"
            onTabShow={(el) => {
              setActive(item.id);
              // Re-sync the large title collapse with this tab's own scroll position.
              el?.dispatchEvent(new Event("scroll"));
            }}
          />
        ))}
      </Tabs>
    </Page>
  );
}
