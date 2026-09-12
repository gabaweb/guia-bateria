import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { defaultModel, models } from "./data/models";
import { compatibleTips, tips } from "./data/tips";
// Keep the original key so existing installations migrate in place.
export const STORAGE_KEY = "guia-bateria:v1";
export type TipStatus = "pending" | "completed" | "later";
export type SavedState = {
  version: 2;
  modelId: string;
  selected: boolean;
  completed: Record<string, string[]>;
  later: Record<string, string[]>;
};
export const initialState: SavedState = {
  version: 2,
  modelId: defaultModel.id,
  selected: false,
  completed: {},
  later: {},
};
export function parseSaved(raw: string | null): SavedState {
  try {
    const value = JSON.parse(raw || "null");
    if (
      !value ||
      ![1, 2].includes(value.version) ||
      !models.some((m) => m.id === value.modelId)
    )
      return initialState;
    const clean = (ids: unknown): string[] =>
      Array.isArray(ids)
        ? [
            ...new Set(
              ids.filter(
                (id): id is string =>
                  typeof id === "string" && tips.some((t) => t.id === id),
              ),
            ),
          ]
        : [];
    const completed: Record<string, string[]> = {};
    const later: Record<string, string[]> = {};
    for (const m of models) {
      const old = value.version === 1 ? value.reviewed : value.completed;
      if (Array.isArray(old?.[m.id])) completed[m.id] = clean(old[m.id]);
      if (value.version === 2 && Array.isArray(value.later?.[m.id]))
        later[m.id] = clean(value.later[m.id]).filter(
          (id) => !completed[m.id]?.includes(id),
        );
    }
    return {
      version: 2,
      modelId: value.modelId,
      selected: value.selected === true,
      completed,
      later,
    };
  } catch {
    return initialState;
  }
}
export function withTipStatus(
  state: SavedState,
  id: string,
  status: TipStatus,
): SavedState {
  const m = models.find((m) => m.id === state.modelId)!;
  if (!compatibleTips(m).some((t) => t.id === id)) return state;
  const completed = (state.completed[m.id] || []).filter((x) => x !== id);
  const later = (state.later[m.id] || []).filter((x) => x !== id);
  if (status === "completed") completed.push(id);
  if (status === "later") later.push(id);
  return {
    ...state,
    completed: { ...state.completed, [m.id]: completed },
    later: { ...state.later, [m.id]: later },
  };
}
function useGuideState() {
  const [saved, setSaved] = useState<SavedState>(() => {
    try {
      return parseSaved(localStorage.getItem(STORAGE_KEY));
    } catch {
      return initialState;
    }
  });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [saved]);
  const model = models.find((m) => m.id === saved.modelId) || defaultModel;
  const available = compatibleTips(model);
  const completed = saved.completed[model.id] || [];
  const later = saved.later[model.id] || [];
  const count = available.filter((t) => completed.includes(t.id)).length;
  const laterCount = available.filter((t) => later.includes(t.id)).length;
  const statusOf = (id: string): TipStatus =>
    completed.includes(id)
      ? "completed"
      : later.includes(id)
        ? "later"
        : "pending";
  const selectModel = (id: string) => {
    if (!models.some((m) => m.id === id)) return;
    setSaved((s) => ({ ...s, modelId: id, selected: true }));
  };
  const setStatus = (id: string, status: TipStatus) =>
    setSaved((s) => withTipStatus(s, id, status));
  const reset = () =>
    setSaved((s) => ({
      ...s,
      completed: { ...s.completed, [s.modelId]: [] },
      later: { ...s.later, [s.modelId]: [] },
    }));
  return {
    saved,
    model,
    available,
    completed,
    later,
    laterCount,
    markedCount: count + laterCount,
    statusOf,
    count,
    selectModel,
    setStatus,
    reset,
    storageError,
  };
}
const GuideContext = createContext<ReturnType<typeof useGuideState> | null>(
  null,
);
export function GuideProvider({ children }: { children: ReactNode }) {
  const value = useGuideState();
  return (
    <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
  );
}
export function useGuide() {
  const value = useContext(GuideContext);
  if (!value) throw new Error("Guia indisponível");
  return value;
}
