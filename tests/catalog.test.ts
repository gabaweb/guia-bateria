import { test } from "node:test";
import assert from "node:assert/strict";
import { models, siriPath, chargingPath } from "../src/data/models";
import { tips, compatibleTips } from "../src/data/tips";
import { parseSaved, initialState } from "../src/state";
const model = (id: string) => models.find((m) => m.id === id)!;
const has = (id: string, tip: string) =>
  compatibleTips(model(id)).some((t) => t.id === tip);
test("primeiras dicas e conteúdo completo para todos os modelos", () => {
  assert.equal(models.length, 31);
  assert.equal(new Set(models.map((m) => m.id)).size, models.length);
  assert.equal(tips.length, 22);
  assert.equal(new Set(tips.map((t) => t.id)).size, tips.length);
  for (const m of models) {
    const available = compatibleTips(m);
    assert.deepEqual(
      available.slice(0, 2).map((t) => t.id),
      ["sugestoes", "brilho"],
    );
    for (const t of available) {
      const c = t.content(m);
      assert.ok(c.path.length >= 2);
      assert.ok(c.steps.length);
      assert.equal(c.steps[0], "Abra o app **Ajustes** no iPhone.");
      assert.ok(c.steps.every(step => (step.match(/\*\*/g) || []).length % 2 === 0));
      assert.ok(c.note.length > 15);
      assert.ok(
        t.sources.every((s) =>
          s.url.startsWith("https://support.apple.com/pt-br/"),
        ),
      );
    }
  }
});
test("SE e iPhone 11 não herdam capacidades incorretas", () => {
  assert.equal(has("se2", "5g"), false);
  assert.equal(has("se3", "5g"), true);
  assert.equal(has("11", "modo-escuro"), false);
  assert.equal(has("11-pro", "modo-escuro"), true);
  for (const id of ["se2", "se3", "11"]) {
    assert.equal(has(id, "quadros"), false);
    assert.equal(has(id, "sempre-ativada"), false);
  }
});
test("ProMotion, Always On e carregamento têm limites distintos", () => {
  assert.equal(has("13-pro", "quadros"), true);
  assert.equal(has("13-pro", "sempre-ativada"), false);
  assert.equal(has("14-pro", "sempre-ativada"), true);
  assert.equal(model("14-pro").chargeLimit, false);
  for (const id of ["15", "15-plus", "16", "16-plus", "16e", "17e"]) {
    assert.equal(model(id).chargeLimit, true);
    assert.equal(has(id, "quadros"), false);
    assert.equal(has(id, "sempre-ativada"), false);
  }
  for (const id of ["17", "air", "17-pro", "17-pro-max"]) {
    assert.equal(has(id, "quadros"), true);
    assert.equal(has(id, "sempre-ativada"), true);
  }
});
test("caminhos de bateria, Siri e carregamento mudam por capacidade", () => {
  assert.equal(siriPath(model("15"))[1], "Siri");
  assert.equal(siriPath(model("15-pro"))[1], "Apple Intelligence e Siri");
  assert.equal(chargingPath(model("14"))[2], "Saúde da Bateria e Carregamento");
  assert.equal(chargingPath(model("15"))[2], "Carregamento");
  const instructions = (tipId: string, modelId: string) =>
    tips.find(t => t.id === tipId)!.content(model(modelId)).steps.join(" ");
  assert.ok(instructions("siri", "se2").includes("Pressionar Início para Siri"));
  assert.ok(instructions("siri", "16").includes("Pressionar Botão Lateral para Siri"));
  assert.ok(!instructions("brilho-automatico", "16").includes("Toque em **Brilho Automático**."));
});
test("instruções consideram gestos do SE e alternativas da Siri", () => {
  const content = (tipId: string, modelId: string) =>
    tips.find(t => t.id === tipId)!.content(model(modelId));
  for (const m of models) {
    for (const tipId of ["brilho"]) {
      const steps = content(tipId, m.id).steps.join(" ");
      const isSE = ["se2", "se3"].includes(m.id);
      assert.equal(steps.includes("borda inferior da tela para cima"), isSE, `${m.id}: ${tipId}`);
      assert.equal(steps.includes("canto superior direito da tela para baixo"), !isSE, `${m.id}: ${tipId}`);
    }
  }
  // Mesmo na família 15, apenas as variantes Pro têm Apple Intelligence.
  assert.ok(!content("siri", "15").steps.join(" ").includes("Apple Intelligence"));
  const siriPro = content("siri", "15-pro").steps.join(" ");
  assert.ok(siriPro.includes("Fale e Digite para a Siri** ou em **Falar com a Siri"));
  assert.ok(siriPro.includes("identificado apenas como **Siri**"));
  assert.equal(content("sugestoes", "14-pro").extra?.path.at(-1), "Saúde da Bateria e Carregamento");
  assert.equal(content("sugestoes", "15").extra?.path.at(-1), "Saúde da Bateria");
});
test("armazenamento inválido é recuperável e dados conhecidos são preservados", () => {
  for (const raw of [
    null,
    "{",
    "null",
    "[]",
    '{"version":9}',
    '{"version":1,"modelId":"fake"}',
  ])
    assert.deepEqual(parseSaved(raw), initialState);
  const result = parseSaved(
    JSON.stringify({
      version: 1,
      modelId: "se3",
      selected: true,
      reviewed: {
        se3: ["sugestoes", "sugestoes", "fake", 3],
        16: ["brilho", "pouca-energia"],
      },
    }),
  );
  assert.equal(result.modelId, "se3");
  assert.deepEqual(result.completed.se3, ["sugestoes"]);
  assert.deepEqual(result.completed["16"], ["brilho"]);
});

test("status novos migram dados antigos e eliminam marcações conflitantes", () => {
  const state = parseSaved(JSON.stringify({version: 2, modelId: "16", selected: true,
    completed: {16: ["sugestoes", "busca", "pouca-energia"]}, later: {16: ["sugestoes", "siri", "siri", "fake", "busca", "pouca-energia"]}}));
  assert.equal(state.version, 2);
  assert.deepEqual(state.completed["16"], ["sugestoes"]);
  assert.deepEqual(state.later["16"], ["siri"]);
});
