import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
function usePwaState() {
  const [online, setOnline] = useState(navigator.onLine);
  const [installed, setInstalled] = useState(
    window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone),
  );
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const sw = useRegisterSW({ onRegisterError: () => setError(true) });
  useEffect(() => {
    let active = true;
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.ready.then(() => {
        if (!active) return;
        setReady(true);
        // The first visit is not controlled by the worker, so warm the shell
        // cache once it is. Later navigations refresh it network-first.
        if (navigator.serviceWorker.controller)
          fetch("/", { cache: "no-store" }).catch(() => undefined);
        else
          navigator.serviceWorker.addEventListener(
            "controllerchange",
            () => fetch("/", { cache: "no-store" }).catch(() => undefined),
            { once: true },
          );
      });
    const offline = () => setOnline(false);
    const online = () => setOnline(true);
    const done = () => setInstalled(true);
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    window.addEventListener("appinstalled", done);
    return () => {
      active = false;
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
      window.removeEventListener("appinstalled", done);
    };
  }, []);
  return { ...sw, online, installed, error, ready };
}
const PwaContext = createContext<ReturnType<typeof usePwaState> | null>(null);
export function PwaProvider({ children }: { children: ReactNode }) {
  const value = usePwaState();
  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}
export function usePwa() {
  return useContext(PwaContext)!;
}
