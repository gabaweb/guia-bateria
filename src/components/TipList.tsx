import { settingsIcons, tipStatusIndicators } from "../data/icons";
import React from "react";
import { List, ListItem, BlockTitle, Icon } from "framework7-react";
import { categories, type Tip } from "../data/tips";
import { useGuide } from "../state";
export function TipList({ items }: { items: Tip[] }) {
  const { statusOf } = useGuide();
  return (
    <>
      {categories.map((c) => {
        const group = items.filter((t) => t.category === c.id);
        return (
          group.length > 0 && (
            <React.Fragment key={c.id}>
              <BlockTitle {...{ role: "heading" }} aria-level={2}>
                {c.name}
              </BlockTitle>
              <List mediaList inset strong dividers className="tip-list">
                {group.map((t) => {
                  const status = statusOf(t.id);
                  const indicator =
                    status === "pending" ? null : tipStatusIndicators[status];
                  return (
                    <ListItem
                      key={t.id}
                      link={`/dica/${t.id}/`}
                      title={t.title}
                      text={t.subtitle}
                      className={`status-${status}`}
                      data-tip={t.id}
                    >
                      <Icon
                        slot="media"
                        {...settingsIcons[t.icon]}
                        className="settings-icon"
                        textColor="white"
                        size={20}
                        aria-hidden="true"
                      />
                      {indicator && (
                        <span
                          slot="subtitle"
                          className={`status-marker ${status} display-flex align-items-center text-color-${indicator.color}`}
                          aria-label={indicator.label}
                        >
                          <Icon
                            f7={indicator.f7}
                            size={18}
                            className="margin-right-half"
                            aria-hidden="true"
                          />
                          {indicator.label}
                        </span>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </React.Fragment>
          )
        );
      })}
    </>
  );
}
