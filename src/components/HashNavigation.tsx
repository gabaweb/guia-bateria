import { useEffect } from "react";
import { useGuide } from "../state";
import { f7 } from "framework7-react";
// Framework7 owns route history. Also support a pasted hash URL in an already-open tab.
export function HashNavigation() {
  const { saved } = useGuide();
  useEffect(() => {
    if (!saved.selected) return;
    const navigateHash = () => {
      const path = window.location.hash.startsWith("#!/")
        ? window.location.hash.slice(2)
        : null;
      const router = f7.views.main?.router;
      if (path && router && router.currentRoute.url !== path)
        router.navigate(path, { browserHistory: false });
    };
    window.addEventListener("hashchange", navigateHash);
    return () => window.removeEventListener("hashchange", navigateHash);
  }, [saved.selected]);
  return null;
}
