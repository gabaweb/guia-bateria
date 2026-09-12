import { test, expect, type Page } from "@playwright/test";
import { offlineServer } from "./offline-server";
const current = (page: Page) => page.locator(".page-current");
async function choose(page: Page, name: string) {
  await expect(current(page)).toHaveCount(1);
  if ((await current(page).getAttribute("data-name")) !== "models")
    await current(page).locator(".model-selector a").click();
  await expect(current(page).getByRole("searchbox")).toHaveCount(0);
  await expect(current(page).locator('input[name="iphone-model"]')).toHaveCount(31);
  const label = current(page)
    .locator("label.item-radio")
    .filter({
      has: page.locator(".item-title", {
        hasText: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
      }),
    });
  await label.click();
  await expect(label.locator('input[type="radio"]')).toBeChecked();
  await current(page)
    .getByRole("button", { name: `Usar ${name}`, exact: true })
    .click();
  await expect(current(page).locator(".model-selector")).toContainText(name);
  await expect.poll(() => new URL(page.url()).hash).toMatch(/^(#!\/)?$/);
}
test.beforeEach(async ({ page }, info) => {
  if (info.title.startsWith("primeiro acesso")) return;
  await page.goto("/");
  await choose(page, "iPhone 16");
});
test("seleção, compatibilidade, marcações, persistência e reinício", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page).toHaveTitle("Guia Bateria");
  await choose(page, "iPhone SE (2ª geração)");
  await expect(current(page).locator('[data-tip="5g"]')).toHaveCount(0);
  await expect(current(page).locator('[data-tip="pouca-energia"]')).toHaveCount(0);
  await expect(current(page).locator('[data-tip="modo-escuro"]')).toHaveCount(
    0,
  );
  await expect(current(page).getByRole("progressbar")).toHaveAttribute(
    "aria-valuemax",
    "18",
  );
  await current(page).locator('[data-tip="sugestoes"] a').click();
  await expect(
    current(page).getByRole("note", { name: "Caminho" }).first().locator("strong"),
  ).toHaveText(["Ajustes", "Bateria"]);
  await current(page)
    .getByRole("button", { name: "Concluir" })
    .click();
  await expect(current(page)).toHaveAttribute("data-name", "home");
  await current(page).locator('[data-tip="brilho"] a').click();
  await expect(current(page)).toHaveAttribute("data-name", "tip-brilho");
  await expect(current(page).locator(".steps")).toContainText("borda inferior da tela para cima");
  await expect(current(page).locator(".steps")).not.toContainText("canto superior direito");
  await page.reload();
  await expect(current(page)).toHaveAttribute("data-name", "tip-brilho");
  await page.getByRole("link", { name: /Voltar/ }).click();
  await expect(current(page).locator("[data-tip]")).toHaveCount(18);
  await expect(current(page).locator(".status-completed")).toHaveCount(1);
  await expect(current(page).locator(".status-pending")).toHaveCount(17);
  await choose(page, "iPhone 17 Pro");
  await expect(
    current(page).locator('[data-tip="sempre-ativada"]'),
  ).toHaveCount(1);
  await expect(current(page).locator('[data-tip="quadros"]')).toHaveCount(1);
  await expect(current(page).getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await current(page).locator('[data-tip="siri"] a').click();
  await expect(
    current(page).getByRole("note", { name: "Caminho" }),
  ).toContainText("Apple Intelligence e Siri");
  await expect(current(page).locator(".steps")).toContainText("Fale e Digite para a Siri ou em Falar com a Siri");
  await page.getByRole("link", { name: /Voltar/ }).click();
  await choose(page, "iPhone SE (2ª geração)");
  await expect(current(page).getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await current(page)
    .getByRole("link", { name: "Progresso", exact: true })
    .click();
  const clearProgress = current(page).getByRole("button", { name: "Limpar progresso" });
  await expect(clearProgress).toHaveClass(/button-fill/);
  expect(
    await clearProgress.evaluate((el) => ({
      background: getComputedStyle(el).backgroundColor,
      color: getComputedStyle(el).color,
    })),
  ).toEqual({ background: "rgb(255, 69, 58)", color: "rgb(255, 255, 255)" });
  await current(page)
    .getByRole("button", { name: "Limpar progresso" })
    .click();
  await page.locator(".dialog-button").filter({ hasText: "Cancelar" }).click();
  await expect(current(page).getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await current(page)
    .getByRole("button", { name: "Limpar progresso" })
    .click();
  await page.locator(".dialog-button").filter({ hasText: "Limpar" }).click();
  await expect(current(page).getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  expect(errors).toEqual([]);
});
test("PWA recarrega com o servidor desligado e conserva progresso", async ({
  page,
}) => {
  const server = await offlineServer();
  try {
    await page.goto(server.url);
    await choose(page, "iPhone 16");
    await current(page).locator('[data-tip="sugestoes"] a').click();
    await current(page)
      .getByRole("button", { name: "Concluir" })
      .click();
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.reload();
    await expect
      .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
      .toBe(true);
    const manifest = await (
      await page.request.get(`${server.url}/manifest.webmanifest`)
    ).json();
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.length).toBe(3);
    await server.close();
    await expect(fetch(server.url)).rejects.toThrow();
    expect(
      await page.evaluate(async () => {
        for (const name of await caches.keys()) {
          const cache = await caches.open(name);
          if (
            (await cache.keys()).some(
              (request) =>
                request.url.includes("Framework7Icons-Regular") &&
                request.url.includes(".woff2"),
            )
          )
            return true;
        }
        return false;
      }),
    ).toBe(true);
    await page.reload();
    await expect(current(page)).toHaveAttribute("data-name", "home");
    await current(page).locator('[data-tip="brilho"] a').click();
    await expect(current(page)).toHaveAttribute("data-name", "tip-brilho");
    expect(
      await page.evaluate(() => JSON.parse(localStorage.getItem("guia-bateria:v1")!).completed["16"]),
    ).toContain("sugestoes");
    await current(page).getByRole("button", { name: "Concluir" }).click();
    await expect(current(page)).toHaveAttribute("data-name", "home");
    await expect(current(page).locator(".status-completed")).toHaveCount(2);
  } finally {
    await server.close();
  }
});
test("links diretos incompatíveis e dados corrompidos não quebram a aplicação", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("corrupted-seeded")) return;
    sessionStorage.setItem("corrupted-seeded", "true");
    localStorage.setItem("guia-bateria:v1", "{quebrado");
  });
  await page.reload();
  await expect(current(page).getByRole("heading", { level: 1 })).toContainText(
    "Qual é o seu iPhone?",
  );
  await choose(page, "iPhone 16");
  await page.goto("/#!/dica/sempre-ativada/");
  await expect(current(page).getByRole("heading", { level: 1 })).toContainText(
    "não se aplica",
  );
  await page.goto("/#!/dica/inexistente/");
  await expect(current(page).getByRole("heading", { level: 1 })).toContainText(
    "não encontrada",
  );
});
test("layout sem transbordamento em celular estreito, iPhone e desktop", async ({
  page,
}) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      current(page).getByRole("link", { name: "Guia", exact: true }),
    ).toBeInViewport();
    await expect(current(page).getByRole("searchbox")).toHaveCount(0);
    await expect(current(page).locator(".filter-control, .category-filter")).toHaveCount(0);
    expect(
      await current(page)
        .locator(".main-navigation .tab-link")
        .evaluateAll((buttons) =>
          buttons.every(
            (button) =>
              button.scrollWidth <= Math.ceil(button.getBoundingClientRect().width),
          ),
        ),
    ).toBe(true);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() =>
        document.fonts.check('24px "Framework7 Icons"'),
      ),
    ).toBe(true);
    await expect(
      current(page).locator('[data-tip="sugestoes"] .f7-icons'),
    ).toBeVisible();
    expect(
      await current(page)
        .locator(".model-selector")
        .evaluate((el) => getComputedStyle(el).borderRadius),
    ).toBe("24px");
    await current(page).locator('[data-tip="brilho-automatico"] a').click();
    const path = current(page).getByRole("note", { name: "Caminho" });
    await expect(path.locator("strong")).toHaveText([
      "Ajustes", "Acessibilidade", "Tela e Tamanho do Texto", "Brilho Automático",
    ]);
    await expect(path.locator('.f7-icons[aria-hidden="true"]')).toHaveCount(3);
    expect(await path.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(17);
    await expect(current(page).locator(".steps .item-title").first()).toHaveText("Abra o app Ajustes no iPhone.");
    await expect(current(page).locator(".steps .item-title strong").first()).toHaveText("Ajustes");
    await expect(current(page).locator(".steps")).not.toContainText("**");
    expect(await current(page).locator(".navbar .left").evaluate(el => getComputedStyle(el).borderRadius)).toBe("64px");
    const rows = await current(page).locator(".steps li").evaluateAll(elements => elements.map(el => {
      const badge = el.querySelector(".badge")!.getBoundingClientRect();
      const text = el.querySelector(".item-title")!.getBoundingClientRect();
      return { aligned: Math.abs(badge.top + badge.height / 2 - text.top - text.height / 2) < 2,
        separated: badge.right < text.left, contained: text.right <= el.getBoundingClientRect().right };
    }));
    expect(rows.length).toBe(5);
    expect(rows.every(row => row.aligned && row.separated && row.contained)).toBe(true);
    await expect(
      current(page).getByRole("button", { name: "Concluir" }),
    ).toBeInViewport();
    expect(
      await current(page).evaluate((el) => el.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});

test("Voltar nativo preserva a origem e o histórico do navegador", async ({
  page,
}) => {
  await page.goto("/");
  await current(page).locator('[data-tip="brilho"] a').click();
  await expect(current(page)).toHaveAttribute("data-name", "tip-brilho");
  await expect(page.locator(".navbar .back:visible")).toHaveCount(1);
  await expect(current(page).locator(".header-nav")).toHaveCount(0);
  await page.getByRole("link", { name: /Voltar/ }).click();
  await expect(current(page)).toHaveAttribute("data-name", "home");
  await current(page)
    .getByRole("link", { name: "Progresso", exact: true })
    .click();
  await expect(current(page)).toHaveAttribute("data-name", "progress");
  await current(page).getByRole("link", { name: "Guia", exact: true }).click();
  await current(page).locator(".model-selector a").click();
  await expect(current(page)).toHaveAttribute("data-name", "models");
  await page.getByRole("link", { name: /Voltar/ }).click();
  await expect(current(page)).toHaveAttribute("data-name", "home");
});

test("Voltar em uma dica aberta diretamente permanece dentro do guia", async ({
  page,
}) => {
  await page.goto("/#!/dica/sugestoes/");
  await expect(current(page)).toHaveAttribute("data-name", "tip-sugestoes");
  await page.reload();
  await page.getByRole("link", { name: /Voltar/ }).click();
  await expect(current(page)).toHaveAttribute("data-name", "home");
  await expect(page).toHaveURL(/\/(#!\/)?$/);
});

test("Para depois é exclusivo, persiste por modelo e soma no progresso", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("migration-seeded")) return;
    sessionStorage.setItem("migration-seeded", "true");
    localStorage.setItem(
      "guia-bateria:v1",
      JSON.stringify({
        version: 1,
        modelId: "16",
        selected: true,
        reviewed: { 16: ["sugestoes"], se2: ["siri"] },
      }),
    );
  });
  await page.reload();
  await expect(current(page).getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await current(page).locator('[data-tip="sugestoes"] a').click();
  await current(page)
    .getByRole("button", { name: "Deixar para depois", exact: true })
    .click();
  await expect(current(page)).toHaveAttribute("data-name", "home");
  await page.reload();
  await expect(current(page)).toHaveAttribute("data-name", "home");
  await expect(current(page).getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await expect(current(page).locator('[data-tip="sugestoes"].status-later .status-marker')).toBeVisible();
  await expect(current(page).locator('[data-tip="sugestoes"].status-pending')).toHaveCount(0);
  await current(page)
    .getByRole("link", { name: "Progresso", exact: true })
    .click();
  await expect(
    current(page).getByRole("button", { name: "Limpar progresso" }),
  ).toBeEnabled();
  await expect(current(page).getByRole("link", { name: /Continuar pelo guia|Retomar dicas/ })).toHaveCount(0);
  await current(page).getByRole("link", { name: "Guia", exact: true }).click();
  await choose(page, "iPhone SE (2ª geração)");
  await expect(current(page).getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await expect(current(page).locator(".status-later")).toHaveCount(0);
  await choose(page, "iPhone 16");
  await current(page)
    .getByRole("link", { name: "Progresso", exact: true })
    .click();
  await current(page)
    .getByRole("button", { name: "Limpar progresso" })
    .click();
  await page
    .locator(".dialog-button")
    .filter({ hasText: /^Limpar$/ })
    .click();
  await expect(
    current(page).getByRole("button", { name: "Limpar progresso" }),
  ).toBeDisabled();
  await page.reload();
  await expect(
    current(page).getByRole("button", { name: "Limpar progresso" }),
  ).toBeDisabled();
});

test("o conteúdo rola sob as barras e nada fica escondido atrás delas", async ({
  page,
}) => {
  test.setTimeout(60000);
  const cases = [
    { width: 390, height: 844, top: 0, bottom: 0, side: 0 },
    { width: 390, height: 844, top: 20, bottom: 0, side: 0 },
    { width: 390, height: 844, top: 59, bottom: 34, side: 0 },
    { width: 844, height: 390, top: 0, bottom: 21, side: 59 },
  ];
  for (const inset of cases) {
    await page.setViewportSize(inset);
    await page.goto("/");
    // Simulate env() values; WebKit desktop cannot reproduce physical iOS chrome.
    await page.evaluate(({ top, bottom, side }) => {
      document.documentElement.style.setProperty("--f7-safe-area-top", `${top}px`);
      document.documentElement.style.setProperty("--f7-safe-area-bottom", `${bottom}px`);
      const view = document.querySelector<HTMLElement>(".view")!;
      view.style.setProperty("--f7-safe-area-left", `${side}px`);
      view.style.setProperty("--f7-safe-area-right", `${side}px`);
    }, inset);
    const check = async () => {
      const scroll = current(page).locator(".page-content:visible");
      await scroll.evaluate((e) => (e.scrollTop = 0));
      // Framework7 layout: the scrollport fills the page, the fixed bars float
      // above it and the padding keeps the first and last rows clear of them.
      await expect
        .poll(() =>
          current(page).evaluate((e) => {
            const content = e.querySelector<HTMLElement>(
              ".page-content.tab-active, .page-content:not(.tab)",
            )!;
            const main = content.querySelector(".content-wrap")!;
            const navbar = e.querySelector(".navbar")!;
            const titleLarge = navbar.querySelector(".title-large");
            const rect = content.getBoundingClientRect();
            const barBottom = Math.max(
              navbar.getBoundingClientRect().bottom,
              titleLarge?.getBoundingClientRect().bottom ?? 0,
            );
            const side = parseFloat(
              getComputedStyle(e.closest(".view")!).getPropertyValue("--f7-safe-area-left"),
            );
            return {
              fills:
                Math.round(rect.top) === 0 &&
                Math.round(rect.bottom) === innerHeight &&
                Math.round(rect.left) === 0 &&
                Math.round(innerWidth - rect.right) === 0,
              clearOfNavbar: main.getBoundingClientRect().top >= barBottom - 1,
              clearOfSides:
                main.getBoundingClientRect().left >= side &&
                innerWidth - main.getBoundingClientRect().right >= side,
            };
          }),
        )
        .toEqual({ fills: true, clearOfNavbar: true, clearOfSides: true });
      await scroll.evaluate((e) => (e.scrollTop = e.scrollHeight));
      expect(
        await current(page).evaluate((e) => {
          const content = e.querySelector<HTMLElement>(
            ".page-content.tab-active, .page-content:not(.tab)",
          )!;
          const main = content.querySelector(".content-wrap")!;
          const toolbar = e.querySelector(".toolbar")!;
          const safeBottom = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--f7-safe-area-bottom"),
          );
          const toolbarRect = toolbar.getBoundingClientRect();
          return {
            atEnd: Math.abs(content.scrollHeight - content.clientHeight - content.scrollTop) < 2,
            clearOfToolbar: main.getBoundingClientRect().bottom <= toolbarRect.top + 1,
            toolbarAboveSafeArea: Math.round(toolbarRect.bottom) === innerHeight,
            toolbarInnerAboveSafeArea:
              toolbar.querySelector(".toolbar-inner")!.getBoundingClientRect().bottom <=
              innerHeight - safeBottom + 1,
          };
        }),
      ).toEqual({
        atEnd: true,
        clearOfToolbar: true,
        toolbarAboveSafeArea: true,
        toolbarInnerAboveSafeArea: true,
      });
      expect(await page.evaluate(() => document.scrollingElement!.scrollTop)).toBe(0);
      expect(
        await page
          .locator(".framework7-root")
          .evaluate((e) => getComputedStyle(e, "::before").content),
      ).toBe("none");
    };
    await check();
    for (const [label, name] of [
      ["Progresso", "progress"],
      ["Sobre", "about"],
      ["Guia", "home"],
    ]) {
      await current(page).getByRole("link", { name: label, exact: true }).click();
      await expect(current(page)).toHaveAttribute("data-name", name);
      await check();
    }
    await current(page).locator('[data-tip="sugestoes"] a').click();
    await expect(current(page)).toHaveAttribute("data-name", "tip-sugestoes");
    await check();
    await expect(current(page).locator(".review-explanation")).toBeInViewport();
    await expect(current(page).getByRole("button", { name: "Concluir" })).toBeInViewport();
    await expect(
      current(page).getByRole("button", { name: "Deixar para depois" }),
    ).toBeInViewport();
    await page.getByRole("link", { name: "Voltar", exact: true }).click();
    await current(page).locator(".model-selector a").click();
    await expect(current(page)).toHaveAttribute("data-name", "models");
    await check();
    await expect(
      current(page).getByRole("button", { name: /Usar iPhone/ }),
    ).toBeInViewport();
  }
});

test("atualização da PWA é automática, sem popup, e mantém o progresso", async ({
  page,
}) => {
  let revision = 1;
  const server = await offlineServer(() => revision);
  try {
    await page.goto(server.url);
    await choose(page, "iPhone 16");
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.reload();
    await current(page).locator('[data-tip="sugestoes"] a').click();
    await current(page)
      .getByRole("button", { name: "Concluir" })
      .click();
    await expect(current(page)).toHaveAttribute("data-name", "home");
    revision = 2;
    const reloaded = page.waitForEvent("load");
    await page.evaluate(() => {
      void navigator.serviceWorker.ready.then((registration) => registration.update());
    });
    await reloaded;
    await expect(page.getByRole("dialog", { name: /Atualização/ })).toHaveCount(0);
    await expect(
      current(page).locator('[data-tip="sugestoes"].status-completed .status-marker'),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          async () => (await navigator.serviceWorker.ready).waiting === null,
        ),
      )
      .toBe(true);
  } finally {
    await server.close();
  }
});

test("abas preservam página, conteúdo e rolagem sem carregar outro documento", async ({
  page,
}) => {
  await page.goto("/");
  const documentRequests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "document")
      documentRequests.push(request.url());
  });
  const originalPage = await current(page).elementHandle();
  const header = await current(page).locator(".navbar").elementHandle();
  const home = page.locator("#home");
  await home.evaluate((el) => (el.scrollTop = 180));
  const homeScroll = await home.evaluate((el) => el.scrollTop);
  for (const name of ["Progresso", "Sobre", "Guia"]) {
    await current(page).getByRole("link", { name, exact: true }).click();
    expect(
      await originalPage!.evaluate(
        (el) => el === document.querySelector(".page-current"),
      ),
    ).toBe(true);
    expect(
      await header!.evaluate(
        (el) => el === document.querySelector(".page-current .navbar"),
      ),
    ).toBe(true);
  }
  await current(page).getByRole("link", { name: "Sobre", exact: true }).click();
  await expect(current(page).getByRole("button", { name: "Instalar Guia Bateria" })).toHaveCount(0);
  await expect(current(page)).not.toContainText("Guia pronto para usar offline");
  await expect(current(page)).toContainText(
    "Depois do primeiro carregamento completo, as dicas funcionam sem internet. Os links da Apple precisam de conexão.",
  );
  await expect(
    current(page).getByRole("link", { name: "Código aberto no GitHub" }),
  ).toHaveAttribute("href", "https://github.com/gabaweb/guia-bateria");
  await current(page).getByRole("link", { name: "Progresso", exact: true }).click();
  await expect(current(page)).not.toContainText(/Todas as dicas|Você pode (retomar|revisar)|Um ajuste de cada vez/);
  await current(page).getByRole("link", { name: "Guia", exact: true }).click();
  expect(await home.evaluate((el) => el.scrollTop)).toBe(homeScroll);
  await current(page).getByRole("link", { name: "Sobre", exact: true }).click();
  await expect(page).toHaveURL(/#!\/sobre\/$/);
  await page.reload();
  await expect(current(page)).toHaveAttribute("data-name", "about");
  expect(documentRequests).toHaveLength(1);
});

test("primeiro acesso exige escolher um iPhone, inclusive por links diretos", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of [
    "/",
    "/#!/sobre/",
    "/#!/progresso/",
    "/#!/dica/sugestoes/",
  ]) {
    await page.goto(path);
    await expect(current(page)).toHaveAttribute("data-name", "models");
    await expect(
      page.locator("[data-tip], .main-navigation, .progressbar"),
    ).toHaveCount(0);
    await expect(
      current(page).getByRole("link", { name: "Voltar", exact: true }),
    ).toHaveCount(0);
    await expect(
      current(page).getByRole("button", { name: "Escolha seu iPhone" }),
    ).toBeDisabled();
    await expect(
      current(page).locator("input[type=radio]:checked"),
    ).toHaveCount(0);
  }
  await choose(page, "iPhone SE (2ª geração)");
  await expect(current(page).locator('[data-tip="5g"]')).toHaveCount(0);
  await page.reload();
  await expect(current(page)).toHaveAttribute("data-name", "home");
  expect(errors).toEqual([]);
});

test("as duas ações retornam ao guia e preservam rolagem sem recarregar", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", request => {
    if (request.resourceType() === "document") requests.push(request.url());
  });
  for (const action of ["Voltar", "Concluir", "Deixar para depois"]) {
      const originPage = await current(page).elementHandle();
      const scroll = page.locator("#home");
      const open = current(page).locator('[data-tip="localizacao"] a');
      await open.scrollIntoViewIfNeeded();
      const top = await scroll.evaluate(el => el.scrollTop);
      await open.click();
      await expect(current(page)).toHaveAttribute("data-name", /tip-/);
      if (action === "Voltar") await current(page).getByRole("link", { name: action, exact: true }).click();
      else await current(page).getByRole("button", { name: action, exact: true }).click();
      await expect(current(page)).toHaveAttribute("data-name", "home");
      expect(await originPage!.evaluate(el => el === document.querySelector(".page-current"))).toBe(true);
      expect(await scroll.evaluate(el => el.scrollTop)).toBe(top);
  }
  expect(requests).toEqual([]);
  await expect(current(page).getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  await page.reload();
  await expect(current(page)).toHaveAttribute("data-name", "home");
  await expect(current(page).getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
});

test("ações salvam uma vez e retornam inclusive na última dica e em links diretos", async ({ page }) => {
  for (const [label, status] of [
    ["Concluir", "completed"],
    ["Concluir", "completed"],
    ["Deixar para depois", "later"],
  ] as const) {
    await current(page).locator('[data-tip="carregamento"] a').click();
    const actions = current(page).locator(".detail-action button");
    await expect(actions).toHaveText(["Concluir", "Deixar para depois"]);
    expect(await actions.evaluateAll(elements => elements.map(el => {
      const style = getComputedStyle(el);
      return { background: style.backgroundColor, color: style.color };
    }))).toEqual([
      { background: "rgb(48, 209, 88)", color: "rgb(0, 0, 0)" },
      { background: "rgba(0, 0, 0, 0)", color: "rgb(255, 159, 10)" },
    ]);
    await current(page).getByRole("button", { name: label, exact: true }).evaluate(el => {
      (el as HTMLButtonElement).click();
      (el as HTMLButtonElement).click();
    });
    await expect(current(page)).toHaveAttribute("data-name", "home");
    await expect(current(page).getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("guia-bateria:v1")!));
    expect(saved[status]["16"].filter((id: string) => id === "carregamento")).toHaveLength(1);
    expect(saved[status === "completed" ? "later" : "completed"]["16"] || []).not.toContain("carregamento");
  }
  for (const label of ["Concluir", "Deixar para depois"]) {
    await page.goto("/#!/dica/sugestoes/");
    await page.reload();
    await current(page).getByRole("button", { name: label, exact: true }).click();
    await expect(current(page)).toHaveAttribute("data-name", "home");
    await expect(page).toHaveURL(/\/(#!\/)?$/);
  }
});
